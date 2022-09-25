#!/bin/bash

yarn install
cp .env.example .env
node ./.devcontainer/set-env.js 