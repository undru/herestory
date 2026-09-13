# Dummy CV fixtures

Fictional, development-only CVs for testing the **Upload CV instead** button on the profile-context step. None of them describes a real person. Nothing in the app imports this folder, so the files are never bundled.

| File                               | Profile                                      |
| ---------------------------------- | -------------------------------------------- |
| `aura-the-plateau-cv.pdf`          | Aura, 40 — the demo persona (Senior Ops Mgr) |
| `mara-the-visibility-shift-cv.txt` | Mara, 47 — The Visibility Shift              |
| `petra-the-ceiling-cv.txt`         | Petra, 38 — The Ceiling                      |
| `renate-the-return-cv.txt`         | Renate, 44 — The Return                      |
| `sabine-the-checklist-cv.txt`      | Sabine, 34 — The Checklist                   |
| `annemarie-the-shrinking-cv.txt`   | Annemarie, 29 — The Shrinking                |

Aura's CV is the demo walkthrough: upload it, use the scripted answers, and pick **Doing well, but stuck** or **Make my work visible to leadership** to get Mara first.

The picker also accepts real PDF, DOC and DOCX files.

## Selecting a fixture

- **iOS Simulator:** drag a fixture file onto the booted Simulator window and save it to **Files › On My iPhone**. In the app, tap **Upload CV instead** and choose the file under **Browse**.
- **Android emulator:** push a fixture to the emulator's Downloads folder:

  ```sh
  adb push test-fixtures/cvs/petra-the-ceiling-cv.txt /sdcard/Download/
  ```

  In the app, tap **Upload CV instead** and choose the file from **Downloads**.

- **Web (`npx expo start --web`):** tap **Upload CV instead** and choose a fixture from this folder in the browser's file dialog.
