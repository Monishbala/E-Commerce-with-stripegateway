const payBtn = document.querySelector(".checkout-btn");

payBtn.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    console.log(cartItems);

    fetch("/stripecheckout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: cartItems,
        })
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.url) {
            window.location.href = data.url;
        } else {
            console.error("Invalid URL received from the server:", data.url);
        }
    })
    .catch((err) => console.error("Fetch error:", err));
});
