# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status=in_progress  # Claim work
bd close <id>         # Complete work
bd sync --from-main   # Sync with main branch (ephemeral workflow)
```

## Development Workflow

### Available Commands

```bash
npm run develop       # Start Strapi development server with hot reload
npm run build         # Build admin panel for production
npm run seed:example  # Populate database with demo data
npm run start         # Start production server
```

### Working with Content Types

This project follows Strapi's standard content type structure. Recent implementations include the real estate marketplace entities (agent, apartment, city):

- **Schema Location**: `src/api/[entity]/content-types/[entity]/schema.json`
- **Controllers**: Use `factories.createCoreController()` pattern
- **Services**: Use `factories.createCoreService()` pattern
- **Routes**: Use `factories.createCoreRouter()` pattern

Example entity relationships:
- Agent hasMany Apartments
- City hasMany Apartments

### API Testing

Test endpoints against the development server:

```bash
# Example: Fetch all agents
curl http://localhost:1337/api/agents

# Example: Fetch all apartments with relations
curl http://localhost:1337/api/apartments?populate=*
```

For detailed API documentation, see [API.md](API.md).

### Documentation References

- [DEVELOPMENT.md](DEVELOPMENT.md) - Backend customization and development guidelines
- [CONTENT-STRUCTURE.md](CONTENT-STRUCTURE.md) - Data models and relationships
- [API.md](API.md) - REST API endpoint documentation
- [SETUP.md](SETUP.md) - Environment configuration and deployment

## Quality Gates

Before committing changes, verify all quality gates pass:

- [ ] **Build verification**: `npm run build` succeeds without errors
- [ ] **TypeScript compilation**: No type errors in TypeScript files
- [ ] **API endpoints**: New content types accessible via REST API (test against `http://localhost:1337/api`)
- [ ] **Schema validation**: Required fields and relationships properly configured
- [ ] **Documentation**: CONTENT-STRUCTURE.md and API.md updated for new entities
- [ ] **Demo data**: `npm run seed:example` still works (if applicable)

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

### MANDATORY WORKFLOW:

1. **File issues for remaining work**
   - Create beads issues for any follow-up tasks
   - Use `bd create --title="..." --type=task|bug|feature --priority=2`

2. **Run quality gates** (if code changed)
   - `npm run build` - Verify admin panel builds successfully
   - Test API endpoints with curl
   - Verify content types in admin panel (if applicable)

3. **Update issue status**
   - Close finished work: `bd close <id>` or `bd close <id1> <id2> ...`
   - Update in-progress items: `bd update <id> --status=...`

4. **GIT SYNC & PUSH** (MANDATORY for ephemeral branches)
   ```bash
   git status              # Check working tree
   git add <files>         # Stage changes
   bd sync --from-main     # Pull beads updates from main
   git commit -m "$(cat <<'EOF'
   Commit message here.

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   EOF
   )"
   git push origin vk/[branch-name]  # Push to remote
   git status              # MUST show "up to date with origin"
   ```

5. **Clean up**
   - Remove temporary files (`.tmp/data.db` if using SQLite)
   - Clean build artifacts (`dist/`, `build/` if present)
   - Verify `.env` not staged (in .gitignore)
   - Clear stashes, prune remote branches

6. **Verify**
   - All code changes committed AND pushed
   - All related beads issues updated
   - Documentation reflects changes

7. **Hand off**
   - Provide context for next session
   - Summarize completed work and remaining tasks

### CRITICAL RULES:

- Work is NOT complete until `git push origin [branch]` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve conflicts and retry until it succeeds
- Use `bd sync --from-main` for ephemeral branches (not standard git pull)

## Git Workflow & Synchronization

### Ephemeral Branch Pattern

This project uses ephemeral feature branches:

- **Branch Pattern**: `vk/[issue-id]-[description]`
- **No Upstream Tracking**: Branch exists locally and on origin but not tracking main
- **Sync Command**: Use `bd sync --from-main` instead of `git pull`
- **Push Requirements**: Must explicitly push to origin before creating PR
- **Branch Lifecycle**: Tied to issue/feature completion, then merged via Pull Request

### Typical Workflow

```bash
# Start work on an issue
bd ready                           # Find available work
bd show <id>                       # Review issue details
bd update <id> --status=in_progress  # Claim it

# During development
npm run develop                    # Start dev server
# ... make changes ...
npm run build                      # Verify build

# Complete work
bd close <id>                      # Mark issue complete
git add .                          # Stage changes
bd sync --from-main                # Sync beads from main
git commit -m "..."                # Commit with message
git push origin vk/[branch-name]   # Push to remote
```

## Troubleshooting

### Build Failures

**Issue**: `npm run build` fails with errors

**Solutions**:
- Check TypeScript errors in terminal output
- Run `npm install` to ensure dependencies are up to date
- Verify `tsconfig.json` configuration
- Check for syntax errors in `src/` files

### API Endpoint Not Responding

**Issue**: Content type not accessible via REST API

**Solutions**:
- Verify schema file exists: `src/api/[type]/content-types/[type]/schema.json`
- Check schema.json has correct `collectionName` and `info` fields
- Restart development server: `npm run develop`
- Check Strapi admin panel to see if content type is registered

### Sync Conflicts

**Issue**: `bd sync --from-main` or `git push` fails with conflicts

**Solutions**:
- Run `git status` to see conflicting files
- Run `git diff` to see specific conflicts
- Resolve conflicts manually in editor
- Stage resolved files with `git add <file>`
- Complete commit and push again

### Beads Commands Not Working

**Issue**: `bd` commands fail or behave unexpectedly

**Solutions**:
- Run `bd doctor` to diagnose configuration issues
- Verify `.beads/metadata.json` exists in project root
- Check beads hooks are properly configured
- Run `bd onboard` to reinitialize if needed

## Project-Specific Context

### Market MiniApp Overview

A Strapi v5.33.2 headless CMS built with TypeScript for managing blog content and real estate marketplace data.

### Recent Implementations

**Real Estate Entities**:
- **Agent**: Real estate agents with name, email, phone, avatar, bio
- **Apartment**: Property listings with relations to agents and cities
- **City**: Location data for apartments

### Content Type Structure

All API entities follow this pattern:

```
src/api/[entity]/
├── content-types/
│   └── [entity]/
│       └── schema.json      # Data model definition
├── controllers/
│   └── [entity].ts          # Request handlers
├── services/
│   └── [entity].ts          # Business logic
└── routes/
    └── [entity].ts          # Route definitions
```

### Key Relationships

- **Agent ↔ Apartment**: One-to-Many (Agent has many Apartments)
- **City ↔ Apartment**: One-to-Many (City has many Apartments)

### Documentation Updates

When adding new content types:
1. Update [CONTENT-STRUCTURE.md](CONTENT-STRUCTURE.md) with entity schema and relationships
2. Update [API.md](API.md) with new endpoint documentation
3. Add example API calls demonstrating the new endpoints

### Quality Standards

- Use TypeScript for all custom code
- Follow Strapi's factory pattern for controllers, services, and routes
- Mark required fields in schema.json with `"required": true`
- Use proper validation for email, phone, and unique fields
- Document relationships with correct relation types (oneToMany, manyToOne, etc.)
