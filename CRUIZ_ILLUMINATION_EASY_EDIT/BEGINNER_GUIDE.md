# CRUIZ ILLUMINATION — Beginner Maintenance Guide

This starter is made with three files: `index.html`, `style.css`, and `script.js`.

## 1. Open and test the site

1. Download and extract the ZIP file.
2. Keep all three files together in one folder.
3. Double-click `index.html` to preview the site in your browser.
4. Edit a file, save it, and refresh the browser to see your changes.

For a more comfortable editing experience, install Visual Studio Code (free) and open the entire folder. You do not need to learn everything before making small changes.

## 2. Add a new product

Open `script.js`. Near the top is the `PRODUCTS` list. Copy one complete product object, paste it before the closing `];`, and change its fields.

Example:

```js
{
  id: "number-5",
  name: "LED Number 5",
  category: "Numbers",
  pricePerDay: 1800,
  available: 1,
  outOfStock: false,
  symbol: "5",
  image: "images/number-5.jpg",
  description: "Warm-white illuminated number for events.",
  featured: false
}
```

Rules:
- Every product needs a unique `id`. Use lowercase letters, numbers and hyphens.
- `pricePerDay` is the rental price for ONE item for ONE day, in LKR.
- `available` is the maximum number of that item you can rent out at once.
- `outOfStock: true` forces the red OUT OF STOCK label on.
- To turn that label off, set `outOfStock: false` and set `available` to the number you really have.
- Put a comma between product objects. Do not put a comma after the last object.
- Do not delete the square brackets around the full product list.

## 3. Add product photos

1. Inside the website folder, create a folder named `images`.
2. Copy your photo into it, for example `number-5.jpg`.
3. In the product object, set `image: "images/number-5.jpg"`.
4. Use the exact same spelling and file extension. `photo.JPG` and `photo.jpg` may not be treated the same on hosting.
5. Prefer well-lit, sharp photos cropped consistently. WebP or JPG is usually suitable.
6. Save `script.js` and refresh the page.

To remove a photo and show the decorative symbol instead, set `image: ""`. You can also delete the image file from the `images` folder if no product uses it.

## 4. Limit stock correctly

Suppose you own eight copies of the letter A:
- Set `available: 8`.
- A customer can add no more than the remaining available quantity in their current bag.
- Set `outOfStock: true` if all copies are unavailable or temporarily out of service.
- When copies return, update `available` and turn `outOfStock` off if appropriate.

Important limitation: this is a static website. Stock is checked in that visitor's browser, not against a shared live stock database. Two different customers can both see the same stock and request it. Always confirm the booking yourself on WhatsApp and update stock manually. For reliable real-time stock across customers, a small database/backend is needed.

## 5. Rental days and prices

In a product object, `pricePerDay` is the price per item per day. The product window has Quantity and Rental days fields. The estimated line total is:

`price per day × quantity × rental days`

For example, LKR 1,500/day × 2 letters × 3 days = LKR 9,000. Delivery charges and refundable deposits are not included in this estimate.

## 6. WhatsApp setup

Near the top of `script.js`, find:

```js
const WHATSAPP_NUMBER = "947XXXXXXXX";
```

Replace it with your business number in international digits-only format. For a Sri Lankan number, use `94` and then the local number without its first zero. Example format: `94771234567`. Do not copy that example unless it is actually your number.

The customer’s browser opens WhatsApp with the message filled in. The customer still has to press Send. A message is a booking request, not a confirmed reservation.

## 7. Cart and saved details

The cart and booking form details are saved in that browser using `localStorage`, so they usually remain after a refresh or when the same browser is opened again. This is not cloud storage. It will not automatically follow a customer to another phone or browser. Customers using private/incognito mode may lose saved data. Do not collect unnecessary sensitive information.

## 8. Remove a product

Find its object inside `PRODUCTS` and delete that whole object, from its opening `{` to its matching `}`. Make sure the objects before and after it still have the correct commas. Save and refresh.

If you may rent that item again later, a simpler option is to set `outOfStock: true` rather than deleting it.

## 9. Change colours or fonts

Open `style.css`. At the top, look for:

```css
:root {
  --ivory: #f8f5ef;
  --paper: #fffdf9;
  --ink: #25231f;
  --muted: #777168;
  --gold: #b18a4a;
  --gold-dark: #8b6932;
}
```

Change these colour values to update the overall look. A hex colour starts with `#` and usually has six letters/numbers. Save and refresh. CSS controls appearance; JavaScript controls product and cart behaviour.

## 10. What the three files do

- `index.html`: page content and the names/IDs of the controls.
- `style.css`: layout, colours, fonts, spacing and mobile styling.
- `script.js`: products, stock labels, search, filtering, calculations, cart, saved browser data and WhatsApp message.

Beginner JavaScript concepts used here:
- `const`: a variable binding that should not be reassigned.
- Objects `{ ... }`: a product's related fields.
- Arrays `[ ... ]`: the list of products or cart items.
- Functions `function name() { ... }`: reusable actions.
- `if`: make a decision.
- `addEventListener`: respond to a click or typing.
- `localStorage`: save small amounts of data in the current browser.
- `map`, `filter`, `find`, `reduce`: common ways to work with lists.

## 11. Host with GitHub and Netlify

### A. Create a GitHub repository
1. Create/sign in to a GitHub account.
2. Click **New repository**.
3. Name it `cruiz-illumination-website`.
4. Choose **Public** if you want the simplest free Netlify setup; never put passwords, secret keys or private customer data in the repository.
5. Create the repository.
6. Use **Add file → Upload files** and upload `index.html`, `style.css`, `script.js`, and the `images` folder if you have one. Commit the changes.

### B. Connect it to Netlify
1. Create/sign in to Netlify.
2. Choose **Add new site** / **Import an existing project**.
3. Select GitHub and authorise access to the repository.
4. Select `cruiz-illumination-website`.
5. For this simple static website, leave build command blank and publish directory as `/` (repository root).
6. Deploy the site. Netlify will give you a public web address.

### C. Update the live site
1. Edit the files on your computer using Visual Studio Code.
2. Test by opening `index.html` locally.
3. On GitHub, open the matching file and choose the pencil/edit option, or upload the updated files.
4. Commit the changes.
5. Netlify detects the GitHub commit and deploys an updated version automatically. Wait for deployment to finish, then refresh the public site.

For image updates, upload the new image into the `images` folder in GitHub and commit it, then update the product's `image` path in `script.js`.

## 12. Before going live

- Replace the example WhatsApp number.
- Replace sample prices, products and stock counts with your real information.
- Test unavailable products and quantity limits.
- Test multiple rental days and the total.
- Test the cart share button and each product share button on a phone.
- Test WhatsApp checkout and ensure the right business number opens.
- Confirm delivery fee, deposit and booking terms manually.
- Remember: this version does not take payments and does not reserve stock globally.
