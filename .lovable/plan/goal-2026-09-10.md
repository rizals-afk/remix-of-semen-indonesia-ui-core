## Goal

Move the notification experience into the account area at `/akun/notifikasi` and match the uploaded BahanMaterial reference.

## Changes

1. **Account route and navigation**
   - Create the notification page as `src/routes/akun.notifikasi.tsx` so it inherits the existing account layout and sidebar.
   - Update the sidebar and header bell to link to `/akun/notifikasi`.
   - Keep `/notifikasi` working as a redirect to the new account route.

2. **Reusable notification UI**
   - Add a reusable notification list item for icon, title, message, timestamp, and unread state.
   - Build two tabs: `Informasi` and `Transaksi`, with tab-specific notification data.
   - Allow an unread item to become read when selected.

3. **Reference-matched presentation**
   - Add the `Notifikasi` title above a bordered white panel.
   - Match the compact tab header, pale blue circular icons, concise rows, right-aligned unread dots, and generous empty panel height shown in the attachment.
   - Keep the page responsive: account content stacks naturally on smaller screens.

4. **Metadata and verification**
   - Add page-specific title, description, Open Graph text, and Twitter card metadata.
   - Verify the new route, old redirect, tab interaction, unread state, desktop layout, and mobile layout in the running preview.

## Out of scope

- No backend/API changes.
- No changes to push notification registration or Firebase behavior.
- No redesign of unrelated account pages.
