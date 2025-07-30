#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the frontend directories to /frontend-example based on user input and creates a new /frontend directory with an app/index.tsx and app/_layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["frontend"];
const exampleDir = "frontend-example";
const newFrontendDir = "frontend";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit frontend/app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const packageJsonContent = `{
  "name": "liftup",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "expo": "~53.0.17",
    "expo-router": "~5.1.3",
    "react": "19.0.0",
    "react-native": "0.79.5"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "typescript": "~5.8.3"
  },
  "private": true
}`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the frontend-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new frontend-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /frontend directory
    const newFrontendDirPath = path.join(root, newFrontendDir);
    await fs.promises.mkdir(newFrontendDirPath, { recursive: true });
    console.log("\n📁 New /frontend directory created.");

    // Create app directory
    const appDirPath = path.join(newFrontendDirPath, "app");
    await fs.promises.mkdir(appDirPath, { recursive: true });
    console.log("📁 frontend/app directory created.");

    // Create index.tsx
    const indexPath = path.join(appDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 frontend/app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(appDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 frontend/app/_layout.tsx created.");

    // Create package.json
    const packageJsonPath = path.join(newFrontendDirPath, "package.json");
    await fs.promises.writeFile(packageJsonPath, packageJsonContent);
    console.log("📄 frontend/package.json created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`cd frontend && npx expo start\` to start a development server.\n2. Edit frontend/app/index.tsx to edit the main screen.${userInput === "y"
        ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
        : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /frontend-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
