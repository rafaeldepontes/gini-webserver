const banner = `   ______ ____ _   __ ____
  / ____//  _// | / //  _/
 / / __  / / /  |/ / / /
/ /_/ /_/ / / /|  /_/ /
\\____//___//_/ |_//___/`
    ;

const lines = [
    { text: "$ gini build\n", type: "command" },
    { text: banner + "\n\n", type: "output", delay: 500 },
    { text: "Project name: ", type: "output", delay: 300 },
    { text: "my-awesome-app\n", type: "command", delay: 800 },
    { text: "Git username: ", type: "output", delay: 300 },
    { text: "nice-user\n", type: "command", delay: 800 },
    { text: ">> Are you going to use Docker? (y/n) ", type: "output", delay: 300 },
    { text: "n\n", type: "command", delay: 800 },
    { text: ">> Are you going to use Nix? (y/n) ", type: "output", delay: 300 },
    { text: "n\n", type: "command", delay: 800 },
    { text: "Build completed successfully\n", type: "output", delay: 300 },
    { text: "$ ls\n", type: "command", delay: 400 },
    { text: "my-awesome-app/\n", type: "output", delay: 300 },
    { text: "$ cd my-awesome-app/\n", type: "command", delay: 400 },
    { text: "$ ls\n", type: "command", delay: 400 },
    { text: "go.mod  main.go  README.md\n", type: "output", delay: 300 },
    { text: "$ ", type: "command", delay: 400 },
];

async function typeWriter(element, text, speed = 40) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

async function runSimulation() {
    const terminal = document.getElementById("terminal-content");
    if (!terminal) return;

    terminal.textContent = "";

    for (const line of lines) {
        await new Promise(resolve => setTimeout(resolve, line.delay || 200));

        const lineElement = document.createElement("span");
        lineElement.className = line.type === "command" ? "command-line" : "output-line";
        terminal.appendChild(lineElement);

        if (line.type === "command") {
            await typeWriter(lineElement, line.text);
        } else {
            lineElement.textContent = line.text;
        }

        const body = document.querySelector(".terminal-body");
        body.scrollTop = body.scrollHeight;
    }

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    terminal.appendChild(cursor);
}

document.addEventListener("DOMContentLoaded", () => {
    runSimulation();

    // Copy to clipboard logic
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = document.querySelector('#install-code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.style.background = '#27c93f';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                }, 2000);
            });
        });
    });
});
