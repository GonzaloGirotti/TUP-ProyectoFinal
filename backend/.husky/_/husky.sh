#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  export husky_skip_init=1
  sh -e "$0" "$@"
  husky_skip_init=
fi