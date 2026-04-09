import { execSync } from 'child_process';

interface PackageJson {
  version?: string;
}

/** commits that changed package.json; oldest to newest */
const commits = execSync(
  'git log --reverse --pretty=format:"%H" -- package.json',
  { encoding: 'utf8' },
)
  .trim()
  .split('\n');

let currentVersion: null | string = null;
for (const commit of commits) {
  const pkgContent = execSync(`git show ${commit}:package.json`, {
    encoding: 'utf8',
  });
  const version = (JSON.parse(pkgContent) as PackageJson).version;

  // only the commits that bump the package.json will be tagged
  if (version && version !== currentVersion) {
    console.log(version);

    const tagName = `v${version}`;

    // skip if tag already exists
    const existingTags = execSync('git tag', { encoding: 'utf8' });
    if (existingTags.includes(tagName)) {
      console.log(`Tag ${tagName} already exists -- skipping`);
      currentVersion = version;
      continue;
    }

    // tag the commit
    execSync(`git tag ${tagName} ${commit}`);
    console.log(`Tagged ${commit.slice(0, 8)} as ${tagName}`);
    currentVersion = version;
  }
}

console.log('Tagging finished');
console.log('To push changes run: git push origin --tags');
