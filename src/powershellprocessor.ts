const PSRunner = {

    process: function (commands: string[]) {
        let self: {
            out: string[];
            err: string[];
        };
        const results: { command: string; output: any; errors: any }[] = [];
        var spawn = require("child_process").spawn;
        var child = spawn("powershell.exe", ['-Command', '-']);
        child.stdout.on("data", function (data: any) {
            self.out.push(data.toString());
        });
        child.stderr.on("data", function (data: any) {
            self.err.push(data.toString());
        });
        child.on("exit", function () {
            console.log("Powershell Script finished");
        });

        commands.forEach(function (cmd) {
            self.out = [];
            self.err = [];
            child.stdin.write(cmd + '\n');
            results.push({ command: cmd, output: self.out, errors: self.err });
        });

        child.stdin.end(); //end input
        return results;
    }
};

export default PSRunner;