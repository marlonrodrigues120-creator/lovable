<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Own the theme in a root-level ThemeProvider and store only the display preference in browser storage, so page navigation cannot reset it.
- Keep client filtering and sorting in a shared pure helper, so card and row views use the same ordered results and rules can be tested independently.
- Define client plans on the client data model and render them through a shared PlanBadge, so list, card and profile views remain consistent.
