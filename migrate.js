const fs = require('fs');
const path = require('path');

const replacements = {
  'android.support.v7.app.AppCompatActivity': 'androidx.appcompat.app.AppCompatActivity',
  'android.support.v7.app.AlertDialog': 'androidx.appcompat.app.AlertDialog',
  'android.support.v7.app.ActionBar': 'androidx.appcompat.app.ActionBar',
  'android.support.v7.widget.Toolbar': 'androidx.appcompat.widget.Toolbar',
  'android.support.v7.widget.SearchView': 'androidx.appcompat.widget.SearchView',
  'android.support.v7.widget.RecyclerView': 'androidx.recyclerview.widget.RecyclerView',
  'android.support.v7.preference.PreferenceFragmentCompat': 'androidx.preference.PreferenceFragmentCompat',
  'android.support.v4.util.SparseArrayCompat': 'androidx.collection.SparseArrayCompat',
  'android.support.v4.app.FragmentManager': 'androidx.fragment.app.FragmentManager',
  'android.support.v4.app.FragmentTransaction': 'androidx.fragment.app.FragmentTransaction',
  'android.support.v4.app.Fragment': 'androidx.fragment.app.Fragment',
  'android.support.v4.app.ListFragment': 'androidx.fragment.app.ListFragment',
  'android.support.v4.app.DialogFragment': 'androidx.fragment.app.DialogFragment',
  'android.support.v4.app.ActivityCompat': 'androidx.core.app.ActivityCompat',
  'android.support.v4.content.ContextCompat': 'androidx.core.content.ContextCompat',
  'android.support.v4.content.pm.ShortcutInfoCompat': 'androidx.core.content.pm.ShortcutInfoCompat',
  'android.support.v4.content.pm.ShortcutManagerCompat': 'androidx.core.content.pm.ShortcutManagerCompat',
  'android.support.v4.graphics.drawable.IconCompat': 'androidx.core.graphics.drawable.IconCompat',
  'android.support.v4.content.FileProvider': 'androidx.core.content.FileProvider',
  'android.support.design.widget.FloatingActionButton': 'com.google.android.material.floatingactionbutton.FloatingActionButton',
  'android.support.annotation.NonNull': 'androidx.annotation.NonNull',
  'android.support.annotation.Nullable': 'androidx.annotation.Nullable',
  'android.arch.persistence.room.Database': 'androidx.room.Database',
  'android.arch.persistence.room.Room': 'androidx.room.Room',
  'android.arch.persistence.room.RoomDatabase': 'androidx.room.RoomDatabase',
  'android.arch.persistence.room.Dao': 'androidx.room.Dao',
  'android.arch.persistence.room.Delete': 'androidx.room.Delete',
  'android.arch.persistence.room.Insert': 'androidx.room.Insert',
  'android.arch.persistence.room.OnConflictStrategy': 'androidx.room.OnConflictStrategy',
  'android.arch.persistence.room.Query': 'androidx.room.Query',
  'android.arch.persistence.room.ColumnInfo': 'androidx.room.ColumnInfo',
  'android.arch.persistence.room.Entity': 'androidx.room.Entity',
  'android.arch.persistence.room.Index': 'androidx.room.Index',
  'android.arch.persistence.room.PrimaryKey': 'androidx.room.PrimaryKey',
  'android.support.v7.widget.LinearLayoutManager': 'androidx.recyclerview.widget.LinearLayoutManager',
  'android.support.v7.widget.DividerItemDecoration': 'androidx.recyclerview.widget.DividerItemDecoration'
};

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.java') || fullPath.endsWith('.xml')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const [key, value] of Object.entries(replacements)) {
                if (content.includes(key)) {
                    content = content.split(key).join(value);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

walkDir('app/src/main/java');
walkDir('app/src/main/res');
walkDir('app/src/main/AndroidManifest.xml');
