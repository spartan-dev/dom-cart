// SELECT ELEMENTS
const productsEl = document.querySelector(".products");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".total-items-in-cart");

// RENDER PRODUCTS

/**
 * @function renderProducts
 * @params no recibe parametros solo se ejecuta para crear dinamicamente el div que contiene la card
 */
function renderProducts() {
  products.forEach((product) => {
    /**
     * recuerden el template extraido del html recibe props para ser dinamico
     * */
    productsEl.innerHTML += `
            <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src="${product.imgSrc}" alt="${product.name}">
                    </div>
                    <div class="desc">
                        <h2>${product.name}</h2>
                        <h2><small>$</small>${product.price}</h2>
                        <p>
                            ${product.description}
                        </p>
                    </div>
                    <div class="add-to-wishlist">
                        <img src="./icons/heart.png" alt="add to wish list">
                    </div>
                    <div class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="./icons/bag-plus.png" alt="add to cart">
                    </div>
                </div>
            </div>
        `;
  });
}
// !importante checar el metodo en el div como onclick = a la funcion addCart(productoId)
renderProducts()

// cart array
/**
 * Esta variable cart nos deja extraer de la memoria local del browser cierta mini info para consultar despues
 * localStorage
 * lleva un or con el objeto vacio o previamente llenado
 * @method getItem()
 */

let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();
//hacemos una llamada a la updateCart funcion que vive mas abajo solita y triste :sad:

// agregar al carrito
/**
 * @function addToCart
 * @param id que viene del template del producto le envia el id al momento del click
 */

function addToCart(id) {
  // checamos su el producto ya esta en el carrito
  if (cart.some((item) => item.id === id)) {
    //si ya esta le suma un + a el que ya existe
    changeNumberOfUnits("plus", id);
  } else {
    //si no esta le empuja un nuevo objeto al arreglo de cart
    const item = products.find((product) => product.id === id);
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
  }

  updateCart();
}

// update cart
function updateCart() {
  //esta llama a el renderCart al momento de refrescar como re-llamada
  renderCartItems();
  //al igual qye esra que revisa el subtotal
  renderSubtotal();

  // save cart to local storage
  //este hace el guardado del elemento en la memoria que vimos arriba se acuerdan ??
  //con uno es set del item y el otro es get del item
  //el metodo de JSON.stringify lo pasa a solo texto solo asi se guarda
  localStorage.setItem("CART", JSON.stringify(cart));
}

// calculate and render subtotal
/**
* @function renderSubtotal
 * tenmos dos variables que son para almacenar el total y el subtotal
* */
function renderSubtotal() {

  let totalPrice = 0
  let  totalItems = 0
 //repasamos el arreglo del carro previamente llenado con el push del addToCart()
  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });
  //llenamos el subtotal que sujeta el valor de html
  subtotalEl.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(
    2
  )}`;
  //llena el lugar del total que sujeta con el total del html
  totalItemsInCartEl.innerHTML = totalItems;
}

// render cart items
/**
 * @function renderCartItems
 * @params no lleva ningun parametro
* */
function renderCartItems() {
  // aca aplicamos el mismo tratamiento que le dimos a los productos
  cartItemsEl.innerHTML = ""; // clear cart element
  //y por cada elemento hacemos un nuevo template que llena el espacio de la lista del carrito
  cart.forEach((item) => {
    cartItemsEl.innerHTML += `
        <div class="cart-item">
            <div class="item-info" onclick="removeItemFromCart(${item.id})">
                <img src="${item.imgSrc}" alt="${item.name}">
                <h4>${item.name}</h4>
            </div>
            <div class="unit-price">
                <small>$</small>${item.price}
            </div>
            <div class="units">
                <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
                <div class="number">${item.numberOfUnits}</div>
                <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>           
            </div>
        </div>
      `;
  });
}
//!importante el onclick de los botones es quien se encarga de de sumar con su funcion de changeNumberOfUnits(simbolo, id)
// remove item from cart
function removeItemFromCart(id) {
  //con este se remueve del arreglo previamente llenado
  cart = cart.filter((item) => item.id !== id);
  // y actualizamos :arrow_down:
  updateCart();
}

// change number of units for an item
/**
 * @function changeNumberOfUnits
 * @param(action) suma o resta
 * @param(id) id de el producto
 * */
function changeNumberOfUnits(action, id) {
  //hacemos un arreglo copia del que ya tenemos
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;
   //validamos si es igual el id que llega del que esta en la iteracion
    if (item.id === id) {
      //disminuiosmos o aumentamos las unidades
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.instock) {
        numberOfUnits++;
      }
    }
 //regresamos el valor con un objeto el item y el numero de unidades
    return {
      ...item,
      numberOfUnits,
    };
  });
// y que cren ? llamamos al update para cambiar de nuevo el carro
  updateCart();
}
