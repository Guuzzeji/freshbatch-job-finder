import argparse
import logging
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import List, Sequence, Tuple

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


TableRef = Tuple[str, str]
TableCount = Tuple[str, str, int]


def _env_first(*names: str) -> str | None:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    return None


def _run_checked(command: Sequence[str], step: str) -> None:
    try:
        subprocess.run(command, check=True, text=True)
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(f"{step} failed with exit code {exc.returncode}") from exc


def _run_capture(command: Sequence[str], step: str) -> str:
    try:
        result = subprocess.run(
            command,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as exc:
        stderr = (exc.stderr or "").strip()
        detail = f". stderr: {stderr}" if stderr else ""
        raise RuntimeError(f"{step} failed with exit code {exc.returncode}{detail}") from exc
    return result.stdout


def _assert_pg_tools_exist() -> None:
    missing = [tool for tool in ("pg_dump", "pg_restore", "psql") if shutil.which(tool) is None]
    if missing:
        missing_list = ", ".join(missing)
        raise RuntimeError(
            "Required PostgreSQL CLI tools are missing: "
            f"{missing_list}. Install PostgreSQL client tools first."
        )


def _quote_identifier(identifier: str) -> str:
    return '"' + identifier.replace('"', '""') + '"'


def _get_tables(connection_string: str) -> List[TableRef]:
    query = """
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """
    output = _run_capture(
        [
            "psql",
            f"--dbname={connection_string}",
            "--tuples-only",
            "--no-align",
            "--field-separator=|",
            f"--command={query}",
        ],
        "fetching table list",
    )
    rows: List[TableRef] = []
    for line in output.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        parts = stripped.split("|", maxsplit=1)
        if len(parts) != 2:
            raise RuntimeError(f"Unexpected psql output while listing tables: {line}")
        rows.append((parts[0], parts[1]))
    return rows


def _get_table_counts(connection_string: str, tables: Sequence[TableRef]) -> List[TableCount]:
    counts: List[TableCount] = []
    for schema, table in tables:
        query = (
            f"SELECT COUNT(*) FROM "
            f"{_quote_identifier(schema)}.{_quote_identifier(table)};"
        )
        output = _run_capture(
            [
                "psql",
                f"--dbname={connection_string}",
                "--tuples-only",
                "--no-align",
                f"--command={query}",
            ],
            f"counting rows in {schema}.{table}",
        )
        count_text = output.strip()
        if not count_text:
            raise RuntimeError(f"Failed to fetch count for {schema}.{table}")
        try:
            row_count = int(count_text)
        except ValueError as exc:
            raise RuntimeError(
                f"Unexpected row count output for {schema}.{table}: {count_text}"
            ) from exc
        counts.append((schema, table, row_count))
    return counts


def _validate_one_to_one(source_url: str, target_url: str) -> None:
    logger.info("Validating copied data with table-level row counts...")
    source_tables = _get_tables(source_url)
    target_tables = _get_tables(target_url)

    if source_tables != target_tables:
        source_only = sorted(set(source_tables) - set(target_tables))
        target_only = sorted(set(target_tables) - set(source_tables))
        details = []
        if source_only:
            details.append(f"missing in target: {source_only[:10]}")
        if target_only:
            details.append(f"extra in target: {target_only[:10]}")
        detail_str = "; ".join(details) if details else "schema/table mismatch"
        raise RuntimeError(f"One-to-one validation failed ({detail_str})")

    source_counts = _get_table_counts(source_url, source_tables)
    target_counts = _get_table_counts(target_url, source_tables)

    mismatches = []
    for src, dst in zip(source_counts, target_counts, strict=True):
        if src[2] != dst[2]:
            mismatches.append((src[0], src[1], src[2], dst[2]))

    if mismatches:
        examples = ", ".join(
            f"{schema}.{table} (source={src_count}, target={dst_count})"
            for schema, table, src_count, dst_count in mismatches[:10]
        )
        raise RuntimeError(
            "One-to-one validation failed: row count mismatch in "
            f"{len(mismatches)} table(s). Examples: {examples}"
        )

    logger.info(
        "Validation successful: %s tables matched between source and target.",
        len(source_tables),
    )


def copy_database_one_to_one(
    source_url: str,
    target_url: str,
    dump_file: str | None,
    keep_dump_file: bool,
    skip_validation: bool,
) -> None:
    _assert_pg_tools_exist()

    if source_url == target_url:
        raise RuntimeError("Source and target connection strings are identical. Aborting.")

    generated_dump = dump_file is None
    if generated_dump:
        with tempfile.NamedTemporaryFile(prefix="pg-copy-", suffix=".dump", delete=False) as tmp:
            dump_path = Path(tmp.name)
    else:
        dump_path = Path(dump_file).expanduser().resolve()
        dump_path.parent.mkdir(parents=True, exist_ok=True)

    logger.info("Starting one-to-one PostgreSQL copy...")
    logger.info("Source: %s", source_url)
    logger.info("Target: %s", target_url)
    logger.info("Dump path: %s", dump_path)
    logger.info("NOTE: To guarantee strict parity, pause writes to source during migration.")

    try:
        dump_cmd = [
            "pg_dump",
            "--format=custom",
            "--no-owner",
            "--no-privileges",
            f"--file={dump_path}",
            source_url,
        ]
        _run_checked(dump_cmd, "pg_dump")

        restore_cmd = [
            "pg_restore",
            "--clean",
            "--if-exists",
            "--no-owner",
            "--no-privileges",
            "--single-transaction",
            "--exit-on-error",
            f"--dbname={target_url}",
            str(dump_path),
        ]
        _run_checked(restore_cmd, "pg_restore")

        if not skip_validation:
            _validate_one_to_one(source_url, target_url)
        else:
            logger.warning("Skipped validation. Use --skip-validation only if you really need to.")

        logger.info("Database copy completed successfully.")
    finally:
        if generated_dump and not keep_dump_file and dump_path.exists():
            dump_path.unlink()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="One-to-one PostgreSQL database copy (schema + data).",
    )
    parser.add_argument(
        "--source-url",
        default=_env_first("SOURCE_DATABASE_URL", "OLD_PROD_DATABASE_URL", "PROD_DATABASE_URL"),
        help="Source PostgreSQL URL. Also supports SOURCE_DATABASE_URL/OLD_PROD_DATABASE_URL.",
    )
    parser.add_argument(
        "--target-url",
        default=_env_first("TARGET_DATABASE_URL", "NEW_PROD_DATABASE_URL"),
        help="Target PostgreSQL URL. Also supports TARGET_DATABASE_URL/NEW_PROD_DATABASE_URL.",
    )
    parser.add_argument(
        "--dump-file",
        default=None,
        help="Optional path for the temporary pg_dump file.",
    )
    parser.add_argument(
        "--keep-dump-file",
        action="store_true",
        help="Keep generated dump file when --dump-file is omitted.",
    )
    parser.add_argument(
        "--skip-validation",
        action="store_true",
        help="Skip table-level row count validation after restore.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()

    if not args.source_url:
        raise RuntimeError("Missing source URL. Provide --source-url or SOURCE_DATABASE_URL.")
    if not args.target_url:
        raise RuntimeError("Missing target URL. Provide --target-url or TARGET_DATABASE_URL.")

    copy_database_one_to_one(
        source_url=args.source_url,
        target_url=args.target_url,
        dump_file=args.dump_file,
        keep_dump_file=args.keep_dump_file,
        skip_validation=args.skip_validation,
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        logger.error(str(exc))
        raise
