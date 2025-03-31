import {
  Product,
  Clothing,
  Appliance,
  products,
  getProduct,
} from "../../../scripts/data/products.js";

describe("Products functionality", () => {
  const product1 = {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
      stars: 4.5,
      count: 87,
    },
    priceCents: 1090,
    keywords: ["socks", "sports", "apparel"],
  };

  const product2 = {
    id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    rating: {
      stars: 4.5,
      count: 56,
    },
    priceCents: 799,
    keywords: ["tshirts", "apparel", "mens"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  };

  const product3 = {
    id: "54e0eccd-8f36-462b-b68a-8182611d9add",
    image: "images/products/black-2-slot-toaster.jpg",
    name: "2 Slot Toaster - Black",
    rating: {
      stars: 5,
      count: 2197,
    },
    priceCents: 1899,
    type: "appliance",
    instructionsLink: "images/appliance-instructions.png",
    warrantyLink: "images/appliance-warranty.png",
    keywords: ["toaster", "kitchen", "appliances"],
  };

  describe("Product class", () => {
    it("creates a product object", () => {
      const product = new Product(product1);

      expect(product.id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
      expect(product.name).toEqual(
        "Black and Gray Athletic Cotton Socks - 6 Pairs"
      );
      expect(product.image).toEqual(
        "images/products/athletic-cotton-socks-6-pairs.jpg"
      );
      expect(product.rating).toEqual({
        stars: 4.5,
        count: 87,
      });
      expect(product.priceCents).toEqual(1090);
      expect(product.keywords).toEqual(undefined);
      expect(typeof product).toEqual("object");
      expect(product instanceof Product).toEqual(true);
      expect(product instanceof Clothing).toEqual(false);
      expect(product instanceof Appliance).toEqual(false);
    });

    it("creates multiple product objects", () => {
      const productsArray = products;

      expect(productsArray.length).toEqual(45);
      expect(productsArray instanceof Product).toEqual(false);
      expect(productsArray instanceof Clothing).toEqual(false);
      expect(productsArray instanceof Appliance).toEqual(false);
      expect(typeof productsArray).toEqual("object");

      const sockProduct = productsArray.find(
        (p) => p.id === "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
      );
      expect(sockProduct instanceof Product).toEqual(true);
      expect(sockProduct.name).toEqual(
        "Black and Gray Athletic Cotton Socks - 6 Pairs"
      );

      const clothingProduct = productsArray.find(
        (p) => p.id === "83d4ca15-0f35-48f5-b7a3-1ea210004f2e"
      );
      expect(clothingProduct instanceof Clothing).toEqual(true);

      const applianceProduct = productsArray.find(
        (p) => p.id === "54e0eccd-8f36-462b-b68a-8182611d9add"
      );
      expect(applianceProduct instanceof Appliance).toEqual(true);
    });

    it("changes the properties of a product object", () => {
      const product = new Product(product1);

      product.id = product2.id;
      product.image = product2.image;
      product.name = product2.name;
      product.rating = product2.rating;
      product.priceCents = product2.priceCents;

      expect(product.id).toEqual("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
      expect(product.name).toEqual("Adults Plain Cotton T-Shirt - 2 Pack");
      expect(product.image).toEqual(
        "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg"
      );
      expect(product.rating).toEqual({
        stars: 4.5,
        count: 56,
      });
      expect(product.priceCents).toEqual(799);
      expect(product.keywords).toEqual(undefined);
      expect(product instanceof Product).toEqual(true);
    });

    it("gets price of the object", () => {
      const product = new Product(product1);
      expect(product.getPrice()).toEqual("$10.90");

      product.priceCents = 2000.4;
      expect(product.getPrice()).toEqual("$20.00");

      product.priceCents = 0;
      expect(product.getPrice()).toEqual("$0.00");

      product.priceCents = undefined;
      expect(product.getPrice()).toEqual("$NaN");
    });

    it("handles edge cases for getPrice", () => {
      const product = new Product({ ...product1 });

      product.priceCents = null;
      expect(product.getPrice()).toEqual("$0.00");

      product.priceCents = -500;
      expect(product.getPrice()).toEqual("$-5.00");

      product.priceCents = 99.5;
      expect(product.getPrice()).toEqual("$1.00");
    });

    it("gets stars url", () => {
      const product = new Product(product1);
      expect(product.getStarsUrl()).toEqual("images/ratings/rating-45.png");

      product.rating.stars = 5;
      expect(product.getStarsUrl()).toEqual("images/ratings/rating-50.png");

      product.rating.stars = 3;
      expect(product.getStarsUrl()).toEqual("images/ratings/rating-30.png");
    });

    it("handles edge cases for getStarsUrl", () => {
      const product = new Product({ ...product1 });

      product.rating = { stars: 0 };
      expect(product.getStarsUrl()).toEqual("images/ratings/rating-0.png");

      // Fix for the failing test - check for specific error type
      // and make sure the method actually throws as expected
      product.rating = {};
      try {
        product.getStarsUrl();
        // If we get here, the method didn't throw
        fail(
          "Expected getStarsUrl to throw an error when rating has no stars property"
        );
      } catch (e) {
        expect(e instanceof TypeError).toBeTruthy();
      }

      product.rating = null;
      try {
        product.getStarsUrl();
        // If we get here, the method didn't throw
        fail("Expected getStarsUrl to throw an error when rating is null");
      } catch (e) {
        expect(e instanceof TypeError).toBeTruthy();
      }
    });

    it("extraInfoHTML returns empty space for base Product", () => {
      const product = new Product(product1);
      expect(product.extraInfoHTML()).toEqual(" ");
    });
  });

  describe("Clothing class", () => {
    it("creates a clothing object", () => {
      const product = new Clothing(product2);

      expect(product.sizeChartLink).toEqual("images/clothing-size-chart.png");
      expect(product instanceof Clothing).toEqual(true);
      expect(product instanceof Product).toEqual(true);
      expect(product instanceof Appliance).toEqual(false);
      expect(typeof product).toEqual("object");
    });

    it("extraInfoHTML gets the size chart of the clothing product", () => {
      const product = new Clothing(product2);
      expect(product.extraInfoHTML()).toEqual(
        `<a href=${product2.sizeChartLink} target="_blank">Size Chart</a>`
      );

      product.sizeChartLink = "images/custom-size-chart.png";
      expect(product.extraInfoHTML()).toEqual(
        `<a href=images/custom-size-chart.png target="_blank">Size Chart</a>`
      );
    });

    it("handles missing sizeChartLink", () => {
      const product = new Clothing({ ...product2, sizeChartLink: undefined });
      expect(product.extraInfoHTML()).toEqual(
        `<a href=undefined target="_blank">Size Chart</a>`
      );
    });
  });

  describe("Appliance class", () => {
    it("creates an appliance object", () => {
      const product = new Appliance(product3);

      expect(product.instructionsLink).toEqual(
        "images/appliance-instructions.png"
      );
      expect(product.warrantyLink).toEqual("images/appliance-warranty.png");
      expect(product instanceof Clothing).toEqual(false);
      expect(product instanceof Product).toEqual(true);
      expect(product instanceof Appliance).toEqual(true);
      expect(typeof product).toEqual("object");
    });

    it("extraInfoHTML gets the instructions and warranty links", () => {
      const product = new Appliance(product3);

      expect(product.extraInfoHTML()).toEqual(
        `<a href=images/appliance-instructions.png target="_blank">Instructions</a>
    <a href=images/appliance-warranty.png target="_blank">Warranty</a>`
      );

      product.instructionsLink = "images/custom-instructions.png";
      product.warrantyLink = "images/custom-warranty.png";
      expect(product.extraInfoHTML()).toEqual(
        `<a href=images/custom-instructions.png target="_blank">Instructions</a>
    <a href=images/custom-warranty.png target="_blank">Warranty</a>`
      );
    });

    it("handles missing links", () => {
      const product = new Appliance({
        ...product3,
        instructionsLink: undefined,
        warrantyLink: null,
      });
      expect(product.extraInfoHTML()).toEqual(
        `<a href=undefined target="_blank">Instructions</a>
    <a href=null target="_blank">Warranty</a>`
      );
    });
  });

  describe("getProduct function", () => {
    it("returns the correct product by id", () => {
      const result = getProduct("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
      expect(result).toBeDefined();
      expect(result.name).toEqual(
        "Black and Gray Athletic Cotton Socks - 6 Pairs"
      );
      expect(result instanceof Product).toEqual(true);
    });

    it("returns the correct clothing product", () => {
      const result = getProduct("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
      expect(result).toBeDefined();
      expect(result.name).toEqual("Adults Plain Cotton T-Shirt - 2 Pack");
      expect(result instanceof Clothing).toEqual(true);
    });

    it("returns the correct appliance product", () => {
      const result = getProduct("54e0eccd-8f36-462b-b68a-8182611d9add");
      expect(result).toBeDefined();
      expect(result.name).toEqual("2 Slot Toaster - Black");
      expect(result instanceof Appliance).toEqual(true);
    });

    it("returns undefined for non-existent product id", () => {
      const result = getProduct("non-existent-id");
      expect(result).toBeUndefined();
    });

    it("handles edge cases", () => {
      expect(getProduct()).toBeUndefined();
      expect(getProduct(null)).toBeUndefined();
      expect(getProduct("")).toBeUndefined();
    });
  });

  describe("Products array mapping", () => {
    it("correctly maps products to their respective classes", () => {
      const regularProduct = products.find((p) => !p.hasOwnProperty("type"));
      const clothingProduct = products.find((p) => p instanceof Clothing);
      const applianceProduct = products.find((p) => p instanceof Appliance);

      expect(regularProduct instanceof Product).toBeTruthy();
      expect(regularProduct instanceof Clothing).toBeFalsy();
      expect(regularProduct instanceof Appliance).toBeFalsy();

      expect(clothingProduct instanceof Product).toBeTruthy();
      expect(clothingProduct instanceof Clothing).toBeTruthy();
      expect(clothingProduct instanceof Appliance).toBeFalsy();
      expect(clothingProduct.sizeChartLink).toBeDefined();

      expect(applianceProduct instanceof Product).toBeTruthy();
      expect(applianceProduct instanceof Clothing).toBeFalsy();
      expect(applianceProduct instanceof Appliance).toBeTruthy();
      expect(applianceProduct.instructionsLink).toBeDefined();
      expect(applianceProduct.warrantyLink).toBeDefined();
    });

    it("counts the correct number of each product type", () => {
      const clothingProducts = products.filter((p) => p instanceof Clothing);
      const applianceProducts = products.filter((p) => p instanceof Appliance);
      const regularProducts = products.filter(
        (p) => !(p instanceof Clothing) && !(p instanceof Appliance)
      );

      expect(clothingProducts.length).toBeGreaterThan(0);
      expect(applianceProducts.length).toBeGreaterThan(0);
      expect(regularProducts.length).toBeGreaterThan(0);
      expect(
        clothingProducts.length +
          applianceProducts.length +
          regularProducts.length
      ).toEqual(products.length);
    });
  });
});
