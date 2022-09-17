# firebot-queue

A user queue firebot plugin with support for custom triggers, multiple queues, and a backend management UI

## Building the plugin

Dev:

1. `npm run build:dev`

- Automatically copies the compiled .js to Firebot's scripts folder.

Release:

1. `npm run build`

- Copy .js from `/dist`

## Features (with completion status)

- [] Queue effects
  - [] join
  - [] leave
  - [] pop
  - [] remove
  - [] peek
- [] Management backend UI
- [] Multiple queue support
- [] Export/backup queues

## Issues to overcome

- Distinct group sizes/group durations per queue
  - Could tie it into command parameters, downside is duplication of information
  -
