// SAMPLE DATA ONLY – shown exclusively in Demo Mode and always labelled as such.
export const demoFindings = [
  { id: 'd1', type: 'outdated_default', severity: 'high', documentation_file: 'README.md', line: 42, documented_value: 'timeout = 30  # seconds', actual_value: 'timeout = 10  # seconds', code_file: 'config.py', code_line: 18, explanation: 'The documented timeout no longer matches the implementation. The default was reduced from 30 to 10 seconds in this pull request.', suggestion: 'Update the documented default timeout to 10 seconds.', confidence: 0.94 },
  { id: 'd2', type: 'signature_mismatch', severity: 'high', documentation_file: 'docs/api.md', line: 87, documented_value: 'createUser(name, email)', actual_value: 'createUser(name, email, role="user")', code_file: 'users/service.py', code_line: 56, explanation: 'createUser gained an optional `role` parameter that is not mentioned in the API reference.', suggestion: 'Document the new `role` parameter and its default value "user".', confidence: 0.91 },
  { id: 'd3', type: 'removed_parameter', severity: 'medium', documentation_file: 'docs/cli.md', line: 23, documented_value: 'docguard run --verbose --cache', actual_value: 'docguard run --verbose', code_file: 'cli/main.py', code_line: 112, explanation: 'The `--cache` flag no longer exists in the argument parser.', suggestion: 'Remove `--cache` from the CLI usage example.', confidence: 0.88 },
  { id: 'd4', type: 'changed_return_type', severity: 'medium', documentation_file: 'docs/api.md', line: 134, documented_value: 'Returns: list[str]', actual_value: 'def list_tags(...) -> dict[str, int]', code_file: 'tags/api.py', code_line: 41, explanation: 'list_tags now returns a mapping of tag to count instead of a list of names.', suggestion: 'Change the documented return type to dict[str, int] and describe the keys and values.', confidence: 0.82 },
  { id: 'd5', type: 'renamed_symbol', severity: 'low', documentation_file: 'CONTRIBUTING.md', line: 15, documented_value: 'run_checks()', actual_value: 'run_all_checks()', code_file: 'tools/check.py', code_line: 9, explanation: 'The function referenced in the contributing guide was renamed.', suggestion: 'Replace `run_checks()` with `run_all_checks()`.', confidence: 0.76 },
]
const mk = (id, repo, pr, ago, files, findings) => ({
  id, repo_url: `https://github.com/${repo}`, pr_number: pr, status: 'completed', source: 'demo',
  created_at: new Date(Date.now() - ago * 3600e3).toISOString(),
  summary: { files_analyzed: files, drift_detected: findings.length }, findings,
  changed_files: ['config.py', 'users/service.py', 'cli/main.py', 'tags/api.py', 'tools/check.py'].slice(0, Math.max(2, findings.length)),
  documentation_files: [...new Set(findings.map((x) => x.documentation_file))],
})
export const demoAnalyses = [
  mk('demo-1', 'acme/payments-api', 42, 2, 12, demoFindings),
  mk('demo-2', 'acme/web-client', 108, 26, 8, demoFindings.slice(0, 2)),
  mk('demo-3', 'acme/infra-tools', 17, 50, 5, []),
  mk('demo-4', 'acme/payments-api', 39, 74, 9, demoFindings.slice(2, 4)),
]
