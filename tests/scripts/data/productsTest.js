import {
  Product,
  Clothing,
  Appliance,
  products,
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
    it("getPrice()", () => {
      const product = new Product(product1);
      expect(product.getPrice()).toEqual("$10.90");

      product.priceCents = 2000.4;
      expect(product.getPrice()).toEqual("$20.00");

      product.priceCents = 0;
      expect(product.getPrice()).toEqual("$0.00");

      product.priceCents = undefined;
      expect(product.getPrice()).toEqual("$NaN");
    });
    it("getStarsUrl()", () => {
      const product = new Product(product1);

      expect(product.getStarsUrl()).toEqual("images/ratings/rating-45.png");
    });
    it("extraInfoHTML", () => {
      const product = new Product(product1);

      expect(product.extraInfoHTML()).toContain(" ");
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

    it("extraInfoHtTML()", () => {
      const product = new Clothing(product2);

      expect(product.extraInfoHTML()).toContain(
        `<a href=images/clothing-size-chart.png target="_blank">Size Chart</a>`
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

    it("extraInfoHtTML()", () => {
      const product = new Clothing(product2);

      expect(product.extraInfoHTML()).toContain(
        `<a href=images/clothing-size-chart.png target="_blank">Size Chart</a>`
      );
    });
  });
});
