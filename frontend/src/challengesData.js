import { AlertTriangle, Shield, BugOff, Code2, Zap, Trophy, Lock, Database, Globe, Cpu } from "lucide-react";

const TEMPLATES = [
  {
    topic: "Security Evaluation",
    icon: AlertTriangle,
    color: "text-amber-400",
    difficulty: "Expert",
    descBase: "The centralized data reporting module allows managers to pass custom mathematical formulas as raw strings to generate business metrics. The backend implementation naively parses this input.",
    taskBase: "The `eval()` function is universally lethal for uncontrolled input. Remove it entirely. Refactor the equation logic to use safely parsed structures to neutralize arbitrary Remote Code Execution.",
    initStart: `# Task: Secure Mathematical Evaluation\n# 1. Import required AST library\n# 2. Extract 'custom_equation' from payload dict (default '0')\n# 3. Evaluate safely without using eval()\n# 4. Return {"status": "success", "calculated": value} OR {"status": "error"} on exception\n\ndef calculate_dynamic_metric_VAR_X(payload, user_context):\n    # Write full code here...\n    pass`,
    solutionStart: `import logging\nimport os\nimport ast\n\ndef calculate_dynamic_metric_VAR_X(payload, user_context):\n    logging.info(f"Processing payload for {user_context['id']}")\n    \n    formula = payload.get('custom_equation', '0')\n    try:\n        # Secure mathematical evaluation utilizing abstract syntax trees\n        computed_val = ast.literal_eval(formula)\n        \n        return {\n            "status": "success", \n            "calculated": computed_val\n        }\n    except Exception as err:\n        logging.error(f"Computation failed: {err}")\n        return {"status": "error"}`,
    testCases: [
      { name: "Remove destructive `eval()` invocation", test: (code) => !code.split(".").includes("eval") && !code.includes("= eval(") },
      { name: "Implement `ast.literal_eval` safely", test: (code) => code.includes("literal_eval(") },
      { name: "Ensure AST library importation", test: (code) => code.includes("import ast") },
      { name: "Maintain exception fallbacks", test: (code) => code.includes("except Exception") },
      { name: "Return sanitized status dict", test: (code) => code.includes('"status": "success"') }
    ]
  },
  {
    topic: "Storage Gateway",
    icon: Database,
    color: "text-rose-400",
    difficulty: "Medium",
    descBase: "The primary database gateway builds dynamic SQL queries by concatenating raw HTTP headers directly into the active SELECT statement buffer.",
    taskBase: "Migrate the f-string concatenation query into a properly parameterized execution block (using `?` bindings) to prevent SQL Injection token attacks.",
    initStart: `# Task: Database Gateway Auth\n# 1. Import sqlite3\n# 2. Implement query to select user_id, role, hash from credentials\n# 3. Use parameterized queries (?) to prevent SQL Injection\n# 4. Fetch one record and return serialize_session(record)\n\ndef authenticate_user_VAR_X(db_cursor, username_input):\n    # Write full code here...\n    pass`,
    solutionStart: `import sqlite3\n\ndef authenticate_user_VAR_X(db_cursor, username_input):\n    # Parameterized query blocks payload execution organically\n    query = "SELECT user_id, role, hash FROM credentials WHERE username = ? AND active = 1"\n    \n    print(f"Executing Query Securely")\n    db_cursor.execute(query, (username_input,))\n    \n    record = db_cursor.fetchone()\n    if record:\n        return serialize_session(record)\n    return None`,
    testCases: [
      { name: "Purge unescaped f-string queries", test: (code) => !code.includes("f\"SELECT") && !code.includes("f'SELECT") },
      { name: "Inject safe parameter bindings (?)", test: (code) => code.includes("?") }
    ]
  },
  {
    topic: "Memory Leak",
    icon: BugOff,
    color: "text-primary-400",
    difficulty: "Hard",
    descBase: "A real-time analytics daemon logs every incoming transaction metric into a persistent global array. Traffic spikes will reliably crash the container due to Out-Of-Memory (OOM) fatal errors.",
    taskBase: "Establish a memory ceiling. Add a conditional check to flush or `.clear()` the `VAR_X` array if its length exceeds a threshold to guarantee stability.",
    initStart: `# Task: Global Cache Management\n# 1. Import time, json\n# 2. Instantiate global array VAR_X = []\n# 3. Parse data_packet via JSON\n# 4. Prevent memory leak: clear VAR_X if len > 5000\n# 5. Append dict with time, payload_size, and raw data\n# 6. Return analyze_trend(VAR_X[-1])\n\nVAR_X = []\n\ndef ingest_metrics_stream(data_packet):\n    # Write full code here...\n    pass`,
    solutionStart: `import time\nimport json\n\n# Global persistent cache payload\nVAR_X = []\n\ndef ingest_metrics_stream(data_packet):\n    timestamp = time.time()\n    parsed_data = json.loads(data_packet)\n    \n    # Safeguard memory\n    if len(VAR_X) > 5000:\n        VAR_X.clear()\n        \n    VAR_X.append({\n        "time": timestamp,\n        "payload_size": len(data_packet),\n        "raw": parsed_data\n    })\n    \n    return analyze_trend(VAR_X[-1])`,
    testCases: [
      { name: "Implement length evaluation threshold", test: (code) => code.includes("len(") && (code.includes(">") || code.includes("==")) },
      { name: "Trigger `.clear()` garbage collection", test: (code) => code.includes(".clear()") },
      { name: "Preserve structural data payload mapping", test: (code) => code.includes("append({") }
    ]
  },
  {
    topic: "Secure Auth",
    icon: Lock,
    color: "text-purple-400",
    difficulty: "Medium",
    descBase: "An administrative routing middleware improperly verifies elevated user identities by comparing incoming token signatures against a plaintext debug integer string.",
    taskBase: "Delete the hardcoded `== '12345'` equality check. Invoke the `cryptography.verify_token` abstraction safely.",
    initStart: `# Task: Middleware Token Verification\n# 1. Extract 'Authorization' string from request_headers\n# 2. Use cryptography.verify_token(token, internal_key) securely\n# 3. Return {"elevated": True, "scope": "admin"} if valid\n# 4. Return {"elevated": False, "scope": "guest"} otherwise\n\ndef validate_admin_elevation_VAR_X(request_headers, internal_key):\n    # Write full code here...\n    pass`,
    solutionStart: `def validate_admin_elevation_VAR_X(request_headers, internal_key):\n    # Extract authorization token\n    auth_bearer = request_headers.get('Authorization', '')\n    \n    # Strict protocol validation check\n    if cryptography.verify_token(auth_bearer, internal_key):\n        return {\"elevated\": True, \"scope\": \"admin\"}\n        \n    return {\"elevated\": False, \"scope\": \"guest\"}`,
    testCases: [
      { name: "Destroy raw plaintext token checks", test: (code) => !code.includes("12345") },
      { name: "Pass token to cryptography handler securely", test: (code) => code.includes("cryptography.verify_token") }
    ]
  },
  {
    topic: "Thread Collisions",
    icon: Zap,
    color: "text-yellow-400",
    difficulty: "Hard",
    descBase: "A dangerous software race condition exists where massive asynchronous thread pools randomly decrement global e-commerce inventory without implementing OS-level execution locks.",
    taskBase: "Import the `threading` interface, instantiate a `Lock()`, and ensure all state modification happens strictly within a `with inventory_lock:` context manager.",
    initStart: `# Task: Safe Concurrent Subtraction\n# 1. Import time, threading module natively\n# 2. Global global_inventory_VAR_X = 100\n# 3. Initialize a threading.Lock()\n# 4. Use context manager (with) to isolate thread operation\n# 5. Subtract requested_qty if sufficient and return success text\n\nglobal_inventory_VAR_X = 100\n# Initialize lock here...\n\ndef process_concurrent_order(order_id, requested_qty):\n    # Write full code here...\n    pass`,
    solutionStart: `import time\nimport threading\n\nglobal_inventory_VAR_X = 100\ninventory_lock = threading.Lock()\n\ndef process_concurrent_order(order_id, requested_qty):\n    global global_inventory_VAR_X\n    \n    # Exclusive lock guarantees single-thread context execution\n    with inventory_lock:\n        current_stock = global_inventory_VAR_X\n        time.sleep(0.01) # Simulating I/O delay\n        \n        if current_stock >= requested_qty:\n            global_inventory_VAR_X -= requested_qty\n            return f"Order {order_id} processed safely."\n            \n        return "Insufficient stock."`,
    testCases: [
      { name: "Instantiate OS execution `Lock()`", test: (code) => code.includes("Lock()") || code.includes("lock") },
      { name: "Wrap execution inside a Context Manager", test: (code) => code.includes("with ") },
      { name: "Execute safe state subtraction block", test: (code) => code.includes("-= requested_qty") }
    ]
  },
  {
    topic: "Cryptography",
    icon: Trophy,
    color: "text-emerald-400",
    difficulty: "Expert",
    descBase: "The active integration engine encrypts core payment identifiers using the legacy MD5 hashing formula. MD5 is mathematically shattered and highly prone to offline rainbow table decryption attacks.",
    taskBase: "Completely purge references to `hashlib.md5`. Upgrade the mathematical hashing algorithm to use the robust `hashlib.sha256` digest format.",
    initStart: `# Task: Secure Payload Signature\n# 1. Import hashlib, base64\n# 2. Combine user, salt_key, amount into colon-separated payload\n# 3. Hash thoroughly utilizing SHA-256 (do NOT use MD5)\n# 4. Return base64 encoded string format of the output digest\n\ndef generate_payment_signature_VAR_X(transaction_payload, salt_key):\n    # Write full code here...\n    pass`,
    solutionStart: `import hashlib\nimport base64\n\ndef generate_payment_signature_VAR_X(transaction_payload, salt_key):\n    # Combine vectors\n    raw_string = f"{transaction_payload['user']}:{salt_key}:{transaction_payload['amount']}"\n    \n    # Valid cryptographic standard implemented\n    hasher = hashlib.sha256()\n    hasher.update(raw_string.encode('utf-8'))\n    \n    digest = hasher.hexdigest()\n    return base64.b64encode(digest.encode()).decode()`,
    testCases: [
      { name: "Remove mathematically compromised MD5 hashing", test: (code) => !code.includes("md5") && !code.includes("MD5") },
      { name: "Initialize secure SHA-256 standard digests", test: (code) => code.includes("sha256") },
      { name: "Format cryptographic output structure", test: (code) => code.includes("hexdigest()") },
      { name: "Encode digest payload arrays", test: (code) => code.includes("encode('utf-8')") },
      { name: "Ensure Base64 transport encoding", test: (code) => code.includes("base64.b64encode") }
    ]
  },
  {
    topic: "Network SSRF",
    icon: Globe,
    color: "text-blue-400",
    difficulty: "Easy",
    descBase: "An external avatar-fetching API blindly accepts user-supplied URIs via GET arrays, enabling devastating Server-Side Request Forgery via internal Docker Networks or local `file://` routing.",
    taskBase: "Implement strict schema protocol enforcement. Add logic to immediately abort or throw a `ValueError` if the requested URI string does not rigidly begin with `https://`.",
    initStart: `# Task: Strict URI Fetching\n# 1. Import requests, flask abort natively\n# 2. Extract profile_url gracefully\n# 3. Validate securely url starts with https://\n# 4. Raise ValueError or abort(400) if protocol fails\n\ndef download_user_avatar_VAR_X(profile_url):\n    # Write full code here...\n    pass`,
    solutionStart: `import requests\nfrom flask import abort\n\ndef download_user_avatar_VAR_X(profile_url):\n    try:\n        # SSRF mitigation via strict schema assertion blocks\n        if not profile_url.startswith("https://"):\n            raise ValueError("Only standard remote SSL endpoints are valid")\n            \n        response = requests.get(profile_url, timeout=5)\n        \n        if response.status_code == 200:\n            return response.content\n        return None\n        \n    except (requests.exceptions.RequestException, ValueError):\n        abort(400, "Unable to fetch avatar")`,
    testCases: [
      { name: "Safeguard against internal routing via HTTPS asserts", test: (code) => code.includes("https://") && (code.includes("ValueError") || code.includes("abort")) }
    ]
  },
  {
    topic: "Hardware Drain",
    icon: Cpu,
    color: "text-pink-400",
    difficulty: "Hard",
    descBase: "High-velocity dynamic logging engines systematically open files continuously without properly terminating their raw handles, quietly creeping up to max out the OS file descriptor hard limits.",
    taskBase: "Modernize the file handler stream logic. Wrap the file reader natively inside Python's context manager using the `with open(...) as f:` auto-closing syntax block.",
    initStart: `# Task: Stream Resource Management\n# 1. Import os, sys\n# 2. Check path viability using os.path.exists\n# 3. Manage execution with open() Context Manager to prevent memory drain\n# 4. Return parse_custom_format(file.read())\n\ndef parse_large_config_VAR_X(config_path):\n    # Write full code here...\n    pass`,
    solutionStart: `import os\nimport sys\n\ndef parse_large_config_VAR_X(config_path):\n    if not os.path.exists(config_path):\n        return {}\n        \n    # Context manager immediately shuts descriptors regardless of exception status\n    with open(config_path, 'r', encoding='utf-8') as config_file:\n        raw_data = config_file.read()\n        parsed = parse_custom_format(raw_data)\n        \n    return parsed`,
    testCases: [
      { name: "Mount explicit `with` scope native handlers", test: (code) => code.includes("with open(") },
      { name: "Auto-close streaming file descriptors", test: (code) => code.includes("as ") },
      { name: "Extract strings internal representation", test: (code) => code.includes(".read()") }
    ]
  },
  {
    topic: "Shell Injection",
    icon: Code2,
    color: "text-cyan-400",
    difficulty: "Easy",
    descBase: "A network diagnostic pipeline script pipes untrusted string inputs straight into the Linux bash parameter set, representing a catastrophic OS Command Injection risk.",
    taskBase: "Rip out the lethal `os.system` invocation. Refactor execution using the sandboxed `subprocess.run` interface securely passing bash arguments as independent array items.",
    initStart: `# Task: Sandboxed OS Execution\n# 1. Import subprocess heavily\n# 2. Do NOT use the legacy lethal os.system() \n# 3. Sandbox execution arrays directly natively: ["ping", "-c", "4", target_ip]\n# 4. Return True mapping against output states natively\n\ndef execute_network_ping_VAR_X(target_ip):\n    # Write full code here...\n    pass`,
    solutionStart: `import subprocess\nfrom datetime import datetime\n\ndef execute_network_ping_VAR_X(target_ip):\n    print(f"[{datetime.now()}] Booting diagnostic sequence")\n    \n    # Strict memory isolation completely nullifies command traversal\n    result = subprocess.run(["ping", "-c", "4", target_ip], capture_output=True)\n    \n    return result.returncode == 0`,
    testCases: [
      { name: "Prevent OS injection vector via parameter arrays", test: (code) => code.includes("subprocess.run") && !code.includes("os.system") }
    ]
  },
  {
    topic: "Poisoned XML",
    icon: Shield,
    color: "text-fuchsia-400",
    difficulty: "Hard",
    descBase: "The B2B integration parser naively compiles raw extensible DOM blocks. An attacker injecting recursive entities will trigger a 'Billion Laughs' denial-of-service memory overload.",
    taskBase: "Defend against logic bombs. Halt parsing utilizing `defusedxml` packages, or rigorously catch exceptions around the `ET.fromstring` tree utilizing a massive `try/except` guard grid.",
    initStart: `# Task: Billion Laughs Mitigation\n# 1. Import xml.etree.ElementTree as ET\n# 2. Decode raw payload array utilizing base64\n# 3. Execute tree traversal natively inside wide try/except safety nets\n# 4. Map traversal records safely returning DOM states\n\ndef ingest_b2b_payload_VAR_X(encoded_xml_string):\n    # Write full code here...\n    pass`,
    solutionStart: `import xml.etree.ElementTree as ET\nimport base64\n\ndef ingest_b2b_payload_VAR_X(encoded_xml_string):\n    raw_xml = base64.b64decode(encoded_xml_string).decode('utf-8')\n    \n    try:\n        # Guarding tree from fatal payload traversal memory limit\n        dom_root = ET.fromstring(raw_xml)\n        \n        records = []\n        for node in dom_root.findall('.//transaction'):\n            records.append({\n                "id": node.get("id"),\n                "amount": float(node.find('amount').text)\n            })\n            \n        return records\n    except ET.ParseError:\n        return []`,
    testCases: [
      { name: "Engage recursive boundary guard safeguards", test: (code) => code.includes("try:") },
      { name: "Construct ET DOM tree element paths", test: (code) => code.includes("ET.fromstring") },
      { name: "Catch memory leakage faults securely", test: (code) => code.includes("except ") || code.includes("except:") }
    ]
  },
  {
    topic: "Path Traversal",
    icon: Database,
    color: "text-orange-400",
    difficulty: "Medium",
    descBase: "A legacy file-serving endpoint parses string inputs directly to system handles, permitting aggressive directory traversal attacks exposing root passwords or source trees.",
    taskBase: "Neutralize local file inclusion (LFI) vulnerability. Utilize the `os.path.basename` extraction utility to enforce strict filename bounding.",
    initStart: `# Task: Local File Inclusion Defense\n# 1. Import os module natively\n# 2. Strip directory traversal payloads strictly utilizing os.path.basename()\n# 3. Construct safe mapped strings utilizing os.path.join() with '/var/cdn/documents'\n# 4. Open array buffers securely utilizing Context Managers\n\ndef fetch_user_document_VAR_X(filename):\n    # Write full code here...\n    pass`,
    solutionStart: `import os\n\ndef fetch_user_document_VAR_X(filename):\n    # Secure filename extraction neutralizes traverse attacks\n    safe_filename = os.path.basename(filename)\n    filepath = os.path.join("/var/cdn/documents", safe_filename)\n    \n    with open(filepath, 'r') as f:\n        return f.read()`,
    testCases: [
      { name: "Eliminate direct filepath string concatenations", test: (code) => !code.includes("f\"/var/cdn") && !code.includes("f'/var/cdn") },
      { name: "Implement strict `os.path.basename` isolation", test: (code) => code.includes("os.path.basename") }
    ]
  },
  {
    topic: "Insecure Deserialization",
    icon: BugOff,
    color: "text-red-500",
    difficulty: "Expert",
    descBase: "The backend session broker deserializes untrusted payload streams utilizing Python's lethal `pickle` module, introducing immediate server-wide Remote Code Execution vectors.",
    taskBase: "Completely purge the native `pickle` library import. Replace the deserialization array with safe structural parsing utilizing `json.loads`.",
    initStart: `# Task: Pickle Execution Purge\n# 1. Import natively secure structural parsing libraries (json, base64)\n# 2. Do NOT touch the globally lethal \`pickle\` module\n# 3. Decode payload sequences string heavily utilizing json.loads\n# 4. Return user_state if verified "admin"\n\ndef process_serialized_session_VAR_X(token_string):\n    # Write full code here...\n    pass`,
    solutionStart: `import json\nimport base64\n\ndef process_serialized_session_VAR_X(token_string):\n    decoded = base64.b64decode(token_string)\n    # Safe data-only structural JSON parsing\n    user_state = json.loads(decoded)\n    \n    return user_state if "admin" in user_state else {}`,
    testCases: [
      { name: "Execute total removal of `pickle` bindings", test: (code) => !code.split(".").includes("pickle") },
      { name: "Refactor string parsing into safe JSON equivalents", test: (code) => code.includes("json.loads") },
      { name: "Maintain Base64 decoding wrapper", test: (code) => code.includes("b64decode") },
      { name: "Evaluate dictionary security roles", test: (code) => code.includes('"admin" in user_state') },
      { name: "Return sanitized fallback object arrays", test: (code) => code.includes("{}") }
    ]
  },
  {
    topic: "Cross-Site Scripting (XSS)",
    icon: Shield,
    color: "text-blue-300",
    difficulty: "Easy",
    descBase: "The custom dashboard HTML rendering templates dynamically reflect unchecked user profile input, paving the way for stored XSS script injection payloads.",
    taskBase: "Neutralize scripting vectors by ensuring the embedded string entity is aggressively encoded using the `html.escape` sanitation module natively prior to rendering.",
    initStart: `# Task: DOM Rendering Sanitization\n# 1. Import formatting natively via html module\n# 2. Extract strictly strings mapping against "username"\n# 3. Disarm structural script wrappers entirely utilizing html.escape\n# 4. Pipe securely back entirely enclosed in <h1> tags\n\ndef render_dashboard_welcome_VAR_X(user_profile):\n    # Write full code here...\n    pass`,
    solutionStart: `import html\n\ndef render_dashboard_welcome_VAR_X(user_profile):\n    display_name = user_profile.get("username", "Guest")\n    # Entity encoding neutralizes script execution\n    safe_name = html.escape(display_name)\n    html_response = f"<div><h1>Welcome back, {safe_name}!</h1></div>"\n    \n    return html_response`,
    testCases: [
      { name: "Wrap payload utilizing `html.escape` sanitizer", test: (code) => code.includes("html.escape") }
    ]
  },
  {
    topic: "Insecure Randomness",
    icon: Zap,
    color: "text-purple-300",
    difficulty: "Medium",
    descBase: "The password recovery service generates pseudo-random reset PINs using highly predictable sequential mathematical seed states, permitting rapid brute-forcing attacks.",
    taskBase: "Replace the deterministic `random` module bindings. Refactor PIN generation natively inside the cryptographically secure hardware RNG library called `secrets`.",
    initStart: `# Task: Hardware RNG Enforcement\n# 1. Import natively hardware cryptosecure \`secrets\` module\n# 2. Strip deterministic sequences via stripping \`random.randint\` arrays\n# 3. Create heavy RNG PIN string bindings entirely internally\n# 4. Pass execution sequences dynamically to send_recovery_email\n\ndef generate_password_reset_VAR_X(user_email):\n    # Write full code here...\n    pass`,
    solutionStart: `import secrets\n\ndef generate_password_reset_VAR_X(user_email):\n    # Cryptographically secure hardware RNG token\n    recovery_pin = secrets.randbelow(900000) + 100000\n    \n    send_recovery_email(user_email, recovery_pin)\n    return True`,
    testCases: [
      { name: "Delete deterministic mathematical PRNG structures", test: (code) => !code.includes("random.randint(") },
      { name: "Mount cryptographically secure `secrets` library generators", test: (code) => code.includes("secrets.randbelow") }
    ]
  },
  {
    topic: "Unvalidated Redirects",
    icon: Globe,
    color: "text-teal-400",
    difficulty: "Medium",
    descBase: "The central authentication router blindly trusts a dynamic `next` URI parameter post-login allowing adversaries to redirect victims to malicious phishing clones.",
    taskBase: "Enforce strict host restriction. Require the `urllib.parse.urlparse` parser natively to evaluate if the `.netloc` property is safely restricted strictly to empty local strings.",
    initStart: `# Task: Host Routing Constraint\n# 1. Import url routing strictly directly via Flask & urlparse array imports\n# 2. Extract routing dynamically internally\n# 3. Extract and verify safely if .netloc structural wrapper entirely restricts to empty paths\n# 4. Force safe redirect natively backwards entirely\n\ndef handle_login_success_VAR_X():\n    # Write full code here...\n    pass`,
    solutionStart: `from flask import redirect, request\nfrom urllib.parse import urlparse\n\ndef handle_login_success_VAR_X():\n    next_url = request.args.get('next', '/dashboard')\n    \n    # Restrict routing strictly to local relative paths\n    if urlparse(next_url).netloc != '':\n        next_url = '/dashboard'\n        \n    return redirect(next_url)`,
    testCases: [
      { name: "Invoke `urlparse` evaluation extraction suites", test: (code) => code.includes("urlparse(") },
      { name: "Enforce safe internal `.netloc` constraint assertions", test: (code) => code.includes(".netloc") }
    ]
  },
  {
    topic: "Timing Differential",
    icon: Code2,
    color: "text-indigo-400",
    difficulty: "Hard",
    descBase: "The webhook validation module compares structurally complex security signatures utilizing standard `==` string equality checks, leaking exact character validation timings per distinct processor clock cycle.",
    taskBase: "Neutralize byte-by-byte mathematical differential timing attacks. Mandate the use of the `hmac.compare_digest` constant-time parity function.",
    initStart: `# Task: Byte-Timing Parity\n# 1. Import memory buffers structurally securely directly\n# 2. Eliminate variable length validation structurally utilizing == comparisons\n# 3. Route comparisons dynamically mapped across hmac.compare_digest function boundaries\n# 4. Return output securely entirely\n\ndef verify_webhook_signature_VAR_X(incoming_sig, expected_sig):\n    # Write full code here...\n    pass`,
    solutionStart: `import hmac\n\ndef verify_webhook_signature_VAR_X(incoming_sig, expected_sig):\n    # Constant-time comparison neutralizes differential timing attacks\n    if hmac.compare_digest(incoming_sig, expected_sig):\n        return True\n        \n    return False`,
    testCases: [
      { name: "Strip native structural equality sequence operator `==`", test: (code) => !code.includes(" == ") },
      { name: "Import memory-safe HMAC integration modules", test: (code) => code.includes("import hmac") },
      { name: "Standardize variable-length evaluation sequence times natively", test: (code) => code.includes("hmac.compare_digest(") },
      { name: "Bind return blocks safely", test: (code) => code.includes("return True") }
    ]
  },
  {
    topic: "Infrastructure Secrets",
    icon: Lock,
    color: "text-pink-600",
    difficulty: "Medium",
    descBase: "The production application connector injects raw active production cloud credentials directly into the static codebase, representing a devastating fatal breach if the repository is ever compromised.",
    taskBase: "Destroy hardcoded strings entirely. Instruct the engine to safely ingest ephemeral active secrets via the OS environmental system abstraction array natively.",
    initStart: `# Task: Ephemeral Configuration\n# 1. Import standard structural wrappers mapping statically securely locally via 'os'\n# 2. Eradicate plaintext structural injection strings actively natively completely\n# 3. Mount dynamically entirely mapping directly to os.environ.get payloads\n# 4. Route array states inside mapped boundaries natively entirely locally\n\ndef configure_system_connector_VAR_X():\n    # Write full code here...\n    pass`,
    solutionStart: `import os\n\ndef configure_system_connector_VAR_X():\n    # Infrastructure configuration relies strictly on ephemeral runtime variables natively\n    access_key = os.environ.get("AWS_ACCESS_KEY_ID")\n    secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")\n    \n    return BootClient("us-east-1", access_key, secret_key)`,
    testCases: [
      { name: "Eradicate raw plaintext infrastructure credentials strings", test: (code) => !code.includes("AKIA") && !code.includes("sk_live") },
      { name: "Ingest securely via OS `.environ.get` abstractions", test: (code) => code.includes("environ.get") }
    ]
  },
  {
    topic: "Regex DoS",
    icon: Cpu,
    color: "text-rose-600",
    difficulty: "Hard",
    descBase: "The backend email validation engine mounts an aggressively nested repeating quantifier evaluation pattern inherently vulnerable to exponential catastrophic backtracking freezing thread availability instantly.",
    taskBase: "Defuse the ReDoS pattern entirely natively. Flatten the explosive matching logic internally into a strictly linear traversal boundary safely extracting the capture group sequences.",
    initStart: `# Task: Regular Expression Unrolling\n# 1. Initialize strictly bound native validation sequences strings structurally robustly locally completely explicitly safely dynamically locally\n# 2. Defuse sequence bounds natively by erasing catastrophic mathematically bounded strings completely entirely natively\n# 3. Reconstruct native string evaluations tightly sequentially\n\ndef validate_bulk_email_VAR_X(email_input):\n    # Write full code here...\n    pass`,
    solutionStart: `import re\n\ndef validate_bulk_email_VAR_X(email_input):\n    # Linear evaluation bounds definitively without nested mathematical capture groups\n    pattern = r"^[a-zA-Z0-9]+@[a-z]+\\.com$"\n    \n    if re.match(pattern, email_input):\n        return True\n    return False`,
    testCases: [
      { name: "Detect catastrophic nested explosive repetition quantifiers", test: (code) => !code.includes("+)*") },
      { name: "Apply atomic linear mapping pattern", test: (code) => code.includes("^[a-zA-Z0-9]+@") },
      { name: "Prevent thread locking validation logic natively", test: (code) => code.includes("re.match") }
    ]
  }
];

const DOMAINS = ["E-Commerce", "Finance", "Healthcare", "Aviation", "Logistics", "Social", "Energy", "Education", "Government", "IoT"];
const SYSTEMS = ["billing", "ledger", "diagnostics", "navigation", "routing", "graph", "sensor", "portal", "tax", "mesh"];

export const CHALLENGES = Array.from({ length: 180 }).map((_, i) => {
  const template = TEMPLATES[i % 18];
  const domain = DOMAINS[Math.floor(i / 10)];
  const system = SYSTEMS[Math.floor(i / 10)];
  
  return {
    id: `mission-${i + 1}`,
    title: `${domain} - ${template.topic} #${i + 1}`,
    difficulty: template.difficulty,
    topic: template.topic,
    icon: template.icon,
    color: template.color,
    description: `Domain Sector: ${domain}. The ${system} system module is failing its automated architecture audits under load. ${template.descBase}`,
    task: template.taskBase.replace(/VAR_X/g, `${system}_handler_${i}`),
    initialCode: template.initStart.replace(/VAR_X/g, `${system}_handler_${i}`),
    solutionCode: template.solutionStart.replace(/VAR_X/g, `${system}_handler_${i}`),
    testCases: template.testCases
  };
});
