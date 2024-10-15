#!/bin/bash

# Function to check conventional commit format
check_conventional_commit() {
    commit_message=$1

    # Regex pattern for conventional commit
    # - type is one of feat, fix, chore, docs, style, refactor, perf, test, build, ci, or revert
    # - scope is optional but if used must be enclosed in parentheses
    # - colon must follow type or scope, followed by a space and a non-empty description
    pattern="^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)(\(\w+\))?:\s.+"

    if [[ $commit_message =~ $pattern ]]; then
        echo "Valid Conventional Commit message."
        return 0
    else
        echo "Invalid Conventional Commit message."
        return 1
    fi
}

# Check if a commit message was passed as argument
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 \"<commit-message>\""
    exit 1
fi

# Call the function with the provided commit message
check_conventional_commit "$1"