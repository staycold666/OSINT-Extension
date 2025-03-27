# Repository Security Setup Instructions

Follow these steps to set up security for your repository while avoiding initial push issues:

## Step 1: Disable any existing branch protection rules

If you've already pushed any files to GitHub and branch protection is enabled:

1. Go to your GitHub repository (https://github.com/yourusername/OSINT-Extension)
2. Click on "Settings" tab
3. In the left sidebar, click on "Branches"
4. If there are existing branch protection rules for your main branch, click the "Edit" button next to it
5. Scroll down and click "Delete" to temporarily remove the protection rule
6. Confirm deletion

## Step 2: Push your local changes

Now try pushing your changes again:

```bash
git add .
git commit -m "Add security configurations"
git push origin main
```

## Step 3: Enable workflow permissions

For the workflow to be able to set branch protection:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Actions" then "General"
4. Scroll down to "Workflow permissions"
5. Select "Read and write permissions"
6. Click "Save"

## Step 4: Run the branch protection workflow

1. Go to your repository's "Actions" tab
2. Click on "Branch Protection" workflow in the left sidebar
3. Click "Run workflow" button in the blue box
4. Select the main branch and click "Run workflow"

## Step 5: Verify security settings

After the workflow completes:

1. Check that branch protection is enabled in Settings > Branches
2. Verify that CODEOWNERS is correctly set up
3. Ensure Dependabot is active
4. Check that CodeQL analysis is running

## Future Changes

For future changes, you'll need to:

1. Create a new branch
2. Make your changes
3. Create a Pull Request
4. Approve and merge the PR as the repository owner

This process ensures all changes are properly reviewed before being merged to the main branch.

## Automatic Branch Deletion

A GitHub Actions workflow has been set up to automatically delete branches after they've been merged:

- When a pull request is closed and merged, the source branch will be automatically deleted
- The main branch and any branch named 'develop' are protected from automatic deletion
- This helps keep your repository clean by removing branches that are no longer needed
- You can still manually restore deleted branches if needed through GitHub's interface

This automation works with the VS Code git extension, so you don't need to manually clean up branches after merging.
