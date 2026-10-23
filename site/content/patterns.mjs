// Editorial content. Examples are illustrative unless sourced.
export const patterns = [
  {
    "slug": "cli-first",
    "title": "Give your agent a CLI",
    "shortTitle": "The CLI pattern",
    "category": "Interfaces",
    "symbol": ">_",
    "reference": "pstack",
    "description": "Make your application easy to operate, inspect, and verify from the terminal.",
    "takeaway": "An agent needs a way to see what happened, not just a way to make things happen.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>Give the agent a small, predictable command-line interface to the system it is changing. Expose the actions a developer would otherwise perform by clicking through a UI, querying a database, or remembering a sequence of scripts.</p><p>The useful loop is simple: discover an action, execute it, inspect the resulting state, and check the outcome. A CLI makes that loop available in the same environment where the agent reads and edits code.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>Use this when an agent can implement a feature but struggles to exercise it. Local applications with fixtures, background jobs, or multi-step workflows are good candidates. Start with the workflow you repeatedly test by hand.</p>"
      },
      {
        "id": "practice",
        "title": "Put it into practice",
        "html": "<ol><li>Expose a narrow set of verbs and make <code>--help</code> explain them.</li><li>Provide structured output and meaningful exit codes.</li><li>Make state observable: return an ID that can be inspected.</li><li>Offer isolated fixtures and a repeatable local reset.</li><li>Make the target environment explicit before changing data.</li></ol><p>The following is a proposed interface for an imaginary task app. It is not pstack syntax.</p>",
        "code": {
          "label": "Illustrative CLI contract",
          "text": "app --help\napp fixtures load demo --env local\napp tasks create --title \"Review the patch\" --json\n# { \"id\": \"task_42\", \"status\": \"open\" }\napp tasks complete task_42 --json\napp tasks inspect task_42 --json\n# { \"id\": \"task_42\", \"status\": \"completed\" }"
        }
      },
      {
        "id": "edges",
        "title": "Where it breaks down",
        "html": "<p>A successful exit code does not prove the product works. Check the resulting state, and use browser checks for visual layout and interactions. Keep credentials out of output and distinguish local and production targets.</p><p>A CLI that hides errors or only emits unstructured logs leaves the agent guessing. Treat the interface as a product that both people and agents can use.</p>"
      },
      {
        "id": "connections",
        "title": "Connect the patterns",
        "html": "<p>Pair this with <a href=\"../scenarios/\">SCENARIOS.md</a>: the document describes the expected behavior; the CLI gives the agent a way to exercise it.</p><aside class=\"note\"><strong>Field note · pstack</strong><p>pstack is the reference proposed for this chapter. A concrete walkthrough is still to be added; the commands above describe the general pattern.</p></aside>"
      }
    ],
    "sources": []
  },
  {
    "slug": "decision-models",
    "title": "Make small decisions explicit",
    "shortTitle": "Decision models",
    "category": "Decisions",
    "symbol": "◇",
    "reference": "jev",
    "description": "Turn recurring judgment calls into small, inspectable decision models.",
    "takeaway": "Write down what makes a choice good before asking an agent to choose.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>Agents encounter dozens of small forks: introduce a dependency, reuse an abstraction, ask for clarification, or keep moving. A lightweight decision model makes the criteria visible so the same discussion does not start from scratch every time.</p><p>For this draft, “decision model” means explicit options, constraints, and a short rule for choosing between them. The jev example will help refine that definition.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>Use this for recurring, bounded choices where the team already has preferences. A few clear criteria are especially helpful when a choice is reversible and prolonged discussion costs more than trying it.</p>"
      },
      {
        "id": "practice",
        "title": "Put it into practice",
        "html": "<p>Record the question, the non-negotiable constraints, the available options, and the deciding factor. Ask the agent to leave a short rationale with the change. Keep the model small enough to actually use.</p>",
        "code": {
          "label": "Example · choosing a dependency",
          "text": "Decision: add a package or use the platform?\n\nConstraints:\n- Must work in the deployment runtime.\n- Must meet the actual feature requirements.\n\nRule:\n1. Prefer the platform if it meets the requirements simply.\n2. Otherwise, compare a maintained package with a local solution.\n3. Escalate if the choice changes a public API or data format.\n\nRecord: choice, decisive reason, and what would change our mind."
        }
      },
      {
        "id": "edges",
        "title": "Where it breaks down",
        "html": "<p>A scoring table can make subjective guesses look precise. A hard constraint should not lose to a weighted average. If evidence is missing, investigate it rather than inventing a score.</p><p>Revisit the model when its assumptions change. High-impact decisions still need appropriate review, even if a rule suggests an answer.</p>"
      },
      {
        "id": "connections",
        "title": "Connect the patterns",
        "html": "<p>Link a frequently used decision model from the relevant <a href=\"../repository-instructions/\">AGENTS.md</a>. Keep the full rationale nearby, and load it when the decision actually arises.</p><aside class=\"note\"><strong>Field note · jev</strong><p>jev is the proposed reference for this chapter. Its specific approach and a worked example still need to be documented.</p></aside>"
      }
    ],
    "sources": []
  },
  {
    "slug": "repository-instructions",
    "title": "Keep instructions close to the code",
    "shortTitle": "AGENTS.md, locally",
    "category": "Context",
    "symbol": "↳",
    "reference": "AGENTS.md",
    "description": "A small root guide, local instructions, and one source of truth across agents.",
    "takeaway": "Put durable project knowledge where the next agent can find it.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>Use a root <code>AGENTS.md</code> for the essentials: how to start the project, which checks matter, and the constraints that are easy to miss. Add a nested file when a directory has genuinely different rules. The format supports local guidance, but discovery and precedence depend on the agent.</p><p>Think of these files as a compact orientation for a capable new teammate.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>This is useful when agents repeatedly miss the same repository convention, or when different packages have distinct build and test workflows. Avoid creating a file in every directory by habit.</p>"
      },
      {
        "id": "practice",
        "title": "Put it into practice",
        "html": "<p>Keep shared instructions at the root and explain only the local differences below it. Check which files your agent actually loads, especially when starting from a subdirectory.</p>",
        "code": {
          "label": "A small instruction hierarchy",
          "text": "repository/\n├── AGENTS.md          # Setup, shared constraints, checks\n├── CLAUDE.md          # Optional compatibility symlink\n├── apps/\n│   └── web/\n│       └── AGENTS.md  # Browser checks and UI conventions\n└── packages/\n    └── engine/\n        └── AGENTS.md # Engine invariants and focused tests"
        }
      },
      {
        "id": "compatibility",
        "title": "One source of truth",
        "html": "<p>For Claude setups that need a compatibility file, a relative symlink avoids maintaining two copies. Run this only when <code>CLAUDE.md</code> does not already exist; merge any existing instructions first.</p>",
        "code": {
          "label": "From the repository root",
          "text": "ln -s AGENTS.md CLAUDE.md\n\n# Alternative: a CLAUDE.md file containing this import\n@AGENTS.md"
        },
        "after": "<p>Current Claude Code documentation describes direct AGENTS.md support from v2.1.277, subject to settings and other instruction files. The symlink is a compatibility technique, not a universal requirement. An import is more portable for Windows teams. <a href=\"https://code.claude.com/docs/en/memory#agentsmd\">Check the current loading rules ↗</a></p>"
      },
      {
        "id": "edges",
        "title": "Where it breaks down",
        "html": "<p>Instructions drift. Remove obsolete commands and duplicated rules during ordinary maintenance. Do not rely on prose as enforcement for a critical invariant: encode it in a check where possible.</p><p>Nested instructions need deliberate discovery. Verify your agent’s behavior rather than assuming every tool interprets the hierarchy identically.</p>"
      }
    ],
    "sources": [
      [
        "AGENTS.md · format and examples",
        "https://agents.md/"
      ],
      [
        "Claude Code · project memory and compatibility",
        "https://code.claude.com/docs/en/memory"
      ]
    ]
  },
  {
    "slug": "less-prompting",
    "title": "Leave room for the model",
    "shortTitle": "Less prompt, more feedback",
    "category": "Context",
    "symbol": "−",
    "reference": "The Bitter Lesson",
    "description": "Give clear goals and useful feedback without scripting every step.",
    "takeaway": "Specify the destination, the constraints, and how success will be checked.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>A long prompt can accumulate yesterday’s workarounds until the actual task is hard to find. Start with the outcome, the relevant constraints, and a way to evaluate the result. Let the agent inspect the code and choose a path.</p><p>This chapter draws an analogy to Rich Sutton’s <em>The Bitter Lesson</em>: general methods that benefit from computation have historically outperformed approaches built around hand-crafted domain knowledge. Applying that idea to coding prompts is an editorial hypothesis, not a result established by the essay.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>Try this when your instructions prescribe every implementation step, repeat facts the agent can discover, or carry fixes for model limitations that may no longer apply.</p>"
      },
      {
        "id": "practice",
        "title": "Put it into practice",
        "html": "<p>Describe observable behavior and the constraints that matter. Point to relevant examples. Supply a check the agent can run, then compare outcomes with and without the extra instructions.</p>",
        "code": {
          "label": "A compact task brief",
          "text": "Add an archive action to projects.\n\nOutcome:\n- Archived projects disappear from the default list.\n- Existing links to an archived project still work.\n- A project can be restored.\n\nConstraints:\n- Follow the existing authorization rules.\n- Preserve the public API response shape.\n\nVerify:\n- Run the focused project tests.\n- Exercise archive → inspect → restore with the local CLI."
        }
      },
      {
        "id": "edges",
        "title": "Where it breaks down",
        "html": "<p>Shorter is not automatically better. Removing essential context can make an agent confidently solve the wrong problem. Keep requirements, unusual domain facts, and boundaries explicit.</p><p>Measure the change on representative tasks. Prompt length is an input; correct, maintainable results are the outcome.</p>"
      },
      {
        "id": "connections",
        "title": "Connect the patterns",
        "html": "<p>Keep durable guidance in <a href=\"../repository-instructions/\">repository instructions</a> and make outcomes observable through a <a href=\"../cli-first/\">CLI</a>. Better feedback gives the agent room to adapt its approach.</p>"
      }
    ],
    "sources": [
      [
        "Rich Sutton · The Bitter Lesson (2019)",
        "http://www.incompleteideas.net/IncIdeas/BitterLesson.html"
      ]
    ]
  },
  {
    "slug": "fewer-comments",
    "title": "Let the code do the talking",
    "shortTitle": "Fewer comments, clearer code",
    "category": "Context",
    "symbol": "//",
    "reference": "Names, types & tests",
    "description": "Make code carry its own meaning, and keep comments for knowledge the code cannot express.",
    "takeaway": "A comment should add information that reading the code would not give you.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>When an agent writes code, it can also produce a running commentary: what each function does, what the next line will do, and why the obvious implementation is obvious. That leaves two descriptions of the same behavior to maintain.</p><p>Start with fewer comments, or none when the code is already clear. Use precise names, explicit types, small functions, and tests that show the intended behavior. Let people and agents read the implementation directly instead of making them reconcile it with a prose translation.</p><p>This is a working hypothesis for collaborating with agents: redundant explanations create another place for context to go stale. The goal is a codebase that is easier to understand and change, not a particular comment count.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>Reach for this when generated changes arrive with a comment above every step, or when comments describe behavior that the implementation no longer has. It matters especially when several agents touch the same area: one may change the code while another reasons from an old explanation.</p><p>It is also a useful review question. If a block needs a paragraph explaining what it does, could a better name, a clearer data structure, or a smaller function make that meaning visible?</p>"
      },
      {
        "id": "practice",
        "title": "Remove the narration",
        "html": "<p>Delete comments that simply restate an operation. If a comment is compensating for an unclear name, fix the name first. Keep the change focused; an unnecessary abstraction can obscure more than a short comment.</p><p>In this example, the comments translate vague names into English. The code itself can carry that meaning.</p>",
        "code": {
          "label": "Before · comments compensate for unclear names",
          "text": "// Check whether the user owns the project.\nconst ok = p.ownerId === u.id;\n\n// Only allow the owner to archive an active project.\nif (ok && p.status === 'active') {\n  archiveProject(p.id);\n}"
        }
      },
      {
        "id": "example",
        "title": "Make meaning explicit",
        "html": "<p>Use the vocabulary of the domain. The same behavior can be understood without the line-by-line explanation.</p>",
        "code": {
          "label": "After · names express the behavior",
          "text": "const isProjectOwner = project.ownerId === user.id;\nconst isActiveProject = project.status === 'active';\n\nif (isProjectOwner && isActiveProject) {\n  archiveProject(project.id);\n}"
        },
        "after": "<p>Pair the implementation with tests for the rules that must survive later edits: an owner can archive an active project, and another user cannot. Tests give future collaborators something to check when they change the code.</p>"
      },
      {
        "id": "edges",
        "title": "Keep what the code cannot tell you",
        "html": "<p>A blanket ban on comments would discard useful knowledge. Keep explanations of surprising constraints, rejected alternatives, external-system quirks, or why an apparently simpler change would be wrong. Put them beside the relevant code, and link to the decision or issue when that helps.</p>",
        "code": {
          "label": "A comment worth keeping · illustrative example",
          "text": "// The legacy importer treats a missing archive date as active.\n// Keep the timestamp until that importer is retired.\nproject.archivedAt = now;"
        },
        "after": "<p>Preserve required license headers, public API documentation, and meaningful tool directives. Document a subtle algorithm when rewriting it would make it less clear. When behavior changes, review the nearby comments as part of the same change.</p><p>Do not move every deleted comment into a giant instruction file. Put shared workflow guidance in repository instructions; keep local rationale close to the implementation.</p>"
      },
      {
        "id": "connections",
        "title": "Connect the patterns",
        "html": "<p>This extends <a href=\"../less-prompting/\">less prompt, more feedback</a> into the codebase: make every explanation earn its place. Use <a href=\"../repository-instructions/\">AGENTS.md</a> for how to work in the repository, <a href=\"../scenarios/\">SCENARIOS.md</a> for observable journeys, and focused comments for intent that would otherwise be lost.</p><aside class=\"note\"><strong>Try it on one change</strong><p>Review an agent-generated patch. Remove narration, improve unclear names, and preserve the reasons behind surprising code. Then check whether the next developer or agent can explain and modify it correctly.</p></aside>"
      }
    ],
    "sources": []
  },
  {
    "slug": "formal-verification",
    "title": "Prove the parts that matter",
    "shortTitle": "A little formal verification",
    "category": "Verification",
    "symbol": "∀",
    "reference": "Lean",
    "description": "Explore machine-checked proofs for small, important pieces of logic.",
    "takeaway": "A proof is only as useful as the property it states and the code it covers.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>Lean is both a programming language and an interactive theorem prover. An agent can help formulate a property, propose a proof, and iterate on feedback from the checker. The promise is a stronger guarantee for a carefully bounded piece of logic.</p><p>Start with a small pure function and an explicit invariant. Keep ordinary tests for the rest of the system.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>Consider this for a compact algorithm or state transition whose correctness matters and whose intended behavior can be expressed precisely. The first challenge is deciding what to prove.</p>"
      },
      {
        "id": "practice",
        "title": "Put it into practice",
        "html": "<p>This tiny example defines a clamped value and states that it cannot exceed its cap. It illustrates the shape of a proof-oriented workflow; it does not verify an external implementation.</p>",
        "code": {
          "label": "Illustrative Lean 4 snippet",
          "text": "def clamp (value cap : Nat) : Nat :=\n  min value cap\n\ntheorem clamp_le_cap (value cap : Nat) :\n    clamp value cap ≤ cap := by\n  exact Nat.min_le_right value cap"
        },
        "after": "<p>Have the agent state the property before attempting the proof. Check the file with the pinned Lean toolchain. Review assumptions and reject unfinished proofs using <code>sorry</code> or unreviewed axioms.</p>"
      },
      {
        "id": "edges",
        "title": "Where it breaks down",
        "html": "<p>A proof of a Lean model does not automatically establish correctness of corresponding TypeScript, Rust, or Python code. The connection to the shipped implementation needs its own justification.</p><p>It is also possible to prove the wrong specification. Review the statement with domain knowledge. I/O, integration, and environmental assumptions may remain outside the proof.</p>"
      },
      {
        "id": "connections",
        "title": "Connect the patterns",
        "html": "<p>Use <a href=\"../scenarios/\">scenarios</a> for end-to-end behavior and proofs for precise local invariants. Both are feedback mechanisms, but they answer different questions.</p><aside class=\"note\"><strong>Research direction</strong><p>This is an exploratory pattern. The next useful addition is a real-world case study with a checked proof and a clear account of what it guarantees.</p></aside>"
      }
    ],
    "sources": [
      [
        "Lean · introduction for programmers",
        "https://lean-lang.org/functional_programming_in_lean/Introduction/"
      ],
      [
        "Lean · theorem proving introduction",
        "https://lean-lang.org/theorem_proving_in_lean4/Introduction/"
      ]
    ]
  },
  {
    "slug": "scenarios",
    "title": "Write scenarios an agent can run",
    "shortTitle": "The SCENARIOS.md pattern",
    "category": "Verification",
    "symbol": "☷",
    "reference": "SCENARIOS.md + CLI",
    "description": "Describe real behavior in plain English, then let an agent exercise it through your CLI.",
    "takeaway": "A scenario needs an observable outcome, not just a list of actions.",
    "sections": [
      {
        "id": "idea",
        "title": "The idea",
        "html": "<p>Keep a <code>SCENARIOS.md</code> file alongside the code with high-level journeys written in plain English. An agent reads a scenario, uses the project’s CLI to perform it, and compares the observed state with the expected outcome.</p><p>This is a proposed repository convention, not a standardized file format. Its value comes from clear expectations and a reliable way to inspect the application.</p>"
      },
      {
        "id": "when",
        "title": "When it helps",
        "html": "<p>Use this for exploratory acceptance checks, workflows spanning several components, or behavior that is easier to explain as a story than as a unit test. It also gives developers a readable inventory of important journeys.</p>"
      },
      {
        "id": "practice",
        "title": "Put it into practice",
        "html": "<p>Give each scenario an ID, an isolated starting state, concrete actions, and an expected result. Ask the agent to record evidence and report pass, fail, or blocked. A blocked check must never silently become a pass.</p>",
        "code": {
          "label": "SCENARIOS.md · example",
          "text": "## S01 — Archive and restore a project\n\nGiven a fresh local fixture with one active project,\nand a user who owns that project:\n\n1. Archive the project through the CLI.\n2. List active projects.\n3. Inspect the archived project by ID.\n4. Restore the project and list active projects again.\n\nExpect:\n- The archived project is absent from the active list.\n- Inspecting it by ID still returns its data.\n- After restoring, it appears exactly once in the active list.\n\nEvidence:\nRecord commands, exit codes, and relevant returned state.\n\nCleanup:\nReset the isolated fixture, even if a check fails."
        }
      },
      {
        "id": "edges",
        "title": "Where it breaks down",
        "html": "<p>An agent can interpret vague language too generously. Prefer observable results over phrases like “works correctly.” Specify fixtures, identities, and cleanup so results do not depend on yesterday’s run.</p><p>Keep stable, critical checks in deterministic automated tests too. Agent-run scenarios provide exploration and acceptance evidence; they do not replace repeatable CI.</p>"
      },
      {
        "id": "connections",
        "title": "Connect the patterns",
        "html": "<p>This closes the loop with <a href=\"../cli-first/\">the CLI pattern</a>: intent lives in the scenario, actions happen through the interface, and state provides the evidence. Link to the scenario file from <a href=\"../repository-instructions/\">AGENTS.md</a> so the next agent knows where to start.</p>"
      }
    ],
    "sources": []
  }
];
