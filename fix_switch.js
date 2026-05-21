const fs = require('fs');

const files = [
    'app/src/main/java/javax/microedition/shell/MicroActivity.java',
    'app/src/main/java/ru/playsoftware/j2meloader/config/ConfigActivity.java',
    'app/src/main/java/ru/playsoftware/j2meloader/config/TemplatesActivity.java',
    'app/src/main/java/ru/playsoftware/j2meloader/applist/AppsListFragment.java',
    'app/src/main/java/ru/playsoftware/j2meloader/settings/KeyMapperActivity.java'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Super hacky but effective for this specific codebase
    // We basically want to replace:
    // switch (item.getItemId()) {
    //    case R.id.action_start: ... break;
    // }
    // with if-else. 

    // Find all switch statements
    const switchPattern = /switch\s*\((.*?)\)\s*\{([\s\S]*?\n\t*)\}/g;
    content = content.replace(switchPattern, (match, switchVar, body) => {
        if (!body.includes('case R.id.')) {
            return match; // pass through
        }
        
        let newBody = body;
        // cases to if
        let first = true;
        
        // This regex matches `case XXX:` or `case XXX: {`
        // We need to carefully split by case/default and replace.
        // It's safer to just change the text directly for Android Resource ID switches
        
        let lines = body.split('\n');
        let out = `int _id = ${switchVar};\n`;
        let inCase = false;
        for (let i=0; i<lines.length; i++) {
            let line = lines[i];
            let m = line.match(/\bcase\s+(R\.id\.[a-zA-Z0-9_]+)\s*:/);
            if (m) {
                let rId = m[1];
                let prefix = first ? "if" : "} else if";
                out += line.replace(m[0], `${prefix} (_id == ${rId}) {`) + "\n";
                first = false;
                inCase = true;
            } else if (line.match(/\bdefault\s*:/)) {
                let prefix = first ? "if (true)" : "} else";
                out += line.replace(/default\s*:/, `${prefix} {`) + "\n";
                inCase = true;
                first = false;
            } else if (line.match(/\bbreak\s*;/)) {
                 // ignore break, it will be handled by the end of block
                 // wait, if we drop breaks, we just do nothing
            } else {
                out += line + "\n";
            }
        }
        // we need to close the last if block (done by the replacement of the closing brace of switch)
        // Wait, the regex `switch(...) { body }` matches the trailing brace.
        // Actually, replacing `break;` with `}` isn't quite right. 
        // It's easier: just replace the switch with a series of if-else.
        return "{ " + out + "}";  
    });
    
    // There are some breaks left that will cause compile errors inside the if-block (break outside loop/switch).
    // Let's replace 'break;' with '' only if it was part of the switch. 
    // Since doing this safely via regex is hard, let's just do manual edit. 
    fs.writeFileSync(file, content, 'utf8');
}
