const pSRunner = {

    process: function (commands: string[]) {
        var self: {
            out: [];
            err: [];
            finished: boolean;
            error: boolean;
        } = { out: [], err: [], finished: false, error: false };

        const results: {
            command: string; output: any; errors: any,
            finished: boolean,
            error: boolean
        }[] = [];
        var spawn = require("child_process").spawn;
        var child = spawn("powershell.exe ", ['-ExecutionPolicy','Bypass', '-Command','-']); 
        child.stdout.on("data", function (data: any) {
            // @ts-ignore
            self.out.push(data.toString());
             console.log(data.toString());
        });
        child.stderr.on("data", function (data: any) {
            // @ts-ignore
            self.err.push(data.toString());
            self.error = true;
             console.log(data.toString());
        });
        child.on("exit", function () {
            self.finished = true;
            console.log("Powershell Script finished");
        });

        commands.forEach(function (cmd) {
            self.out = [];
            self.err = [];
            child.stdin.write(cmd + '\n');
            results.push({
                command: cmd, output: self.out, errors: self.err, finished: self.finished,
                error: self.error
            });
        });

        child.stdin.end(); //end input
        return results;
    }
};

export default pSRunner;