# Prompt – Generate Script to Find All package.json and Run npm Cache Clean

## 🎯 Purpose
Generate a shell script that searches for all projects containing a `package.json` file within a parent folder and runs `npm cache clean --force` in each project, excluding `node_modules` directories.

---

## 🧠 Instructions
When I provide you with a parent directory path (e.g., `~/work/develop`), generate a shell script that:

1. Recursively finds all `package.json` files up to 3 levels deep.
2. Skips any path that contains `node_modules`.
3. Prints the path of each project being cleaned.
4. Executes `npm cache clean --force` inside each project folder.
5. Returns ONLY the final script — no explanation, no commentary.

---

## 📥 Input Format
```
<absolute path to the parent directory>
```

Example:
```
~/work/develop
```

---

## 📤 Expected Output Format
Shell script only.

Example output structure:
```
find <path> -maxdepth 3 -type f -name package.json | while read pkg; do
  repo=$(dirname "$pkg")
  if [[ "$repo" != *"node_modules"* ]]; then
    echo "Cleaning npm cache in: $repo"
    (cd "$repo" && npm cache clean --force)
  fi
done
```

---

## 🧪 Example Input
```
~/work/develop
```

## 🧪 Example Output
```
find ~/work/develop -maxdepth 3 -type f -name package.json | while read pkg; do
  repo=$(dirname "$pkg")
  if [[ "$repo" != *"node_modules"* ]]; then
    echo "Cleaning npm cache in: $repo"
    (cd "$repo" && npm cache clean --force)
  fi
done
```
