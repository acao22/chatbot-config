# Chatbot Config Editor - Angie Cao

This is the frontend technical challenge that I coded, that allows users to modify json configs and choose actions/instructions with a friendly user interface per the specifications!

I used Next.js project with Typescript and Tailwind CSS.

## Input and Output of config

Input: It is on the home page as a user input text UI box
Output: The json is printed to the console.

## Basic Requirements

- Add new actions (`AcceptOffer`, `RejectOffer`, or `SubmitBotInstruction`) to the configuration.
- Edit the name and instructions of actions.
- Prevent duplicate action names and empty action names.
- Remove actions from the configuration.
- Export the updated configuration and print it to the console.
- User-friendly alert system for success and error messages (e.g., duplicate names).

## Things I added

- Added alerts to notify the user whenever they create a new object, when the json is successfully exported to the console, or a warning when there are duplicate names
- Added some drop shadow hover animation on the buttons
- Added cards, dropdown menu, and alert UI from Shadcn UI and with tailwind css
- A scrollable right side and fixed left side; I made it so that the right side automatically goes to the bottom so that the user can see their latest input

## Project Setup

### 1. **Clone the repository**

```bash
git clone https://github.com/acao22/chatbot-config
cd chatbot-config
npm install
npm run dev
npm run build
```
