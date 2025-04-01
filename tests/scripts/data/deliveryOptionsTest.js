import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../../scripts/data/deliveryOptions.js";
// Import test framework and mocking utilities
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

describe("Delivery Options Module Tests", () => {
  describe("Delivery Options Data", () => {
    it("should contain exactly 3 delivery options", () => {
      // Test logic here
      expect(deliveryOptions).toBeDefined();
      expect(Array.isArray(deliveryOptions)).toBe(true);
      expect(deliveryOptions.length).toBe(3);
    });

    it("should have all options with required properties (id, deliveryDays, priceCents)", () => {
      // Test logic here
      deliveryOptions.forEach((option) => {
        expect(option.id).toBeDefined();
        expect(option.deliveryDays).toBeDefined();
        expect(option.priceCents).toBeDefined();

        // Check types of properties
        expect(typeof option.id).toBe("string");
        expect(typeof option.deliveryDays).toBe("number");
        expect(typeof option.priceCents).toBe("number");

        // Check values are valid
        expect(option.id.length).toBeGreaterThan(0);
        expect(option.deliveryDays).toBeGreaterThan(0);
        expect(option.priceCents).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have the correct values for each option", () => {
      // Verify first option (shipping)
      expect(deliveryOptions[0].id).toBe("1");
      expect(deliveryOptions[0].deliveryDays).toBe(7);
      expect(deliveryOptions[0].priceCents).toBe(0);

      // Verify second option (priority)
      expect(deliveryOptions[1].id).toBe("2");
      expect(deliveryOptions[1].deliveryDays).toBe(3);
      expect(deliveryOptions[1].priceCents).toBe(499);

      // Verify third option (express)
      expect(deliveryOptions[2].id).toBe("3");
      expect(deliveryOptions[2].deliveryDays).toBe(1);
      expect(deliveryOptions[2].priceCents).toBe(999);
    });
  });

  describe("getDeliveryOption Function", () => {
    it("should return the correct delivery option when given a valid ID", () => {
      // Test logic here
      const option1 = getDeliveryOption("1");
      const option2 = getDeliveryOption("2");
      const option3 = getDeliveryOption("3");

      expect(option1).toBeDefined();
      expect(option1.id).toBe("1");
      expect(option1.deliveryDays).toBe(7);
      expect(option1.priceCents).toBe(0);

      expect(option2).toBeDefined();
      expect(option2.id).toBe("2");
      expect(option2.deliveryDays).toBe(3);
      expect(option2.priceCents).toBe(499);

      expect(option3).toBeDefined();
      expect(option3.id).toBe("3");
      expect(option3.deliveryDays).toBe(1);
      expect(option3.priceCents).toBe(999);
    });

    it("should return the first option when given an invalid ID", () => {
      // Test logic here
      const invalidOption = getDeliveryOption("invalid");
      const defaultOption = getDeliveryOption("1");

      expect(invalidOption).toBeDefined();
      expect(invalidOption).toEqual(defaultOption);
      expect(invalidOption.id).toBe("1");
      expect(invalidOption.deliveryDays).toBe(7);
      expect(invalidOption.priceCents).toBe(0);
    });

    it("should return the first option when given no ID", () => {
      // Test logic here
      const undefinedOption = getDeliveryOption();
      const nullOption = getDeliveryOption(null);
      const emptyOption = getDeliveryOption("");
      const defaultOption = getDeliveryOption("1");

      expect(undefinedOption).toBeDefined();
      expect(undefinedOption).toEqual(defaultOption);
      expect(undefinedOption.id).toBe("1");

      expect(nullOption).toBeDefined();
      expect(nullOption).toEqual(defaultOption);

      expect(emptyOption).toBeDefined();
      expect(emptyOption).toEqual(defaultOption);
    });
  });

  describe("calculateDeliveryDate Function", () => {
    // Setup for date mocking would go here
    // Setup and teardown hooks
    let today;

    beforeEach(() => {
      // Mock the current date to be consistent for tests
      today = dayjs();
    });

    it("should add the correct number of delivery days to the current date", () => {
      // Test logic here
      // Test for each delivery option
      const option1 = deliveryOptions[0];
      const option2 = deliveryOptions[1];
      const option3 = deliveryOptions[2];

      // Calculate delivery dates for each option
      const date1 = calculateDeliveryDate(option1);
      const date2 = calculateDeliveryDate(option2);
      const date3 = calculateDeliveryDate(option3);

      // Verify each date is correctly calculated
      const expectedDate1 = today
        .add(option1.deliveryDays, "day")
        .format("dddd, MMMM D");
      const expectedDate2 = today
        .add(option2.deliveryDays + 2, "day")
        .format("dddd, MMMM D");

      const expectedDate3 = today
        .add(option3.deliveryDays, "day")
        .format("dddd, MMMM D");

      expect(date1).toBe(expectedDate1);
      expect(date2).toBe(expectedDate2);
      expect(date3).toBe(expectedDate3);
    });

    it("should adjust delivery dates that fall on Saturday (adding 2 days)", () => {
      // Use a specific date instead of relative day calculation for more explicit testing
      const mockDay = dayjs("2023-07-19");

      const deliveryDays = 3; // This would land on Saturday (July 22)
      const mockOption = { deliveryDays, priceCents: 499 };

      // Pass the mock day to calculate delivery date
      const deliveryDate = calculateDeliveryDate(mockOption, mockDay);

      // Explicitly verify it's Monday and not Saturday
      // Use the parse plugin to correctly parse the formatted date
      const year = mockDay.year(); // Get the year from the mock date
      const resultDate = dayjs(
        `${deliveryDate}, ${year}`,
        "dddd, MMMM D, YYYY"
      );

      expect(resultDate.format("dddd")).not.toBe("Saturday");
      expect(resultDate.format("dddd")).toBe("Monday");

      // Should be Monday (Wednesday + 3 days + 2 weekend days)
      const expectedDate = mockDay
        .add(deliveryDays + 2, "day")
        .format("dddd, MMMM D");
      expect(deliveryDate).toBe(expectedDate);
    });

    it("should adjust delivery dates that fall on Sunday (adding 1 day)", () => {
      // Use a specific date instead of relative day
      const mockDay = dayjs("2023-07-20"); // Thursday
      const deliveryDays = 3; // This would land on Sunday (July 23)
      const mockOption = { deliveryDays, priceCents: 499 };

      const deliveryDate = calculateDeliveryDate(mockOption, mockDay);

      // Explicitly verify it's Monday and not Saturday
      // Use the parse plugin to correctly parse the formatted date
      const year = mockDay.year(); // Get the year from the mock date
      const resultDate = dayjs(
        `${deliveryDate}, ${year}`,
        "dddd, MMMM D, YYYY"
      );
      expect(resultDate.format("dddd")).not.toBe("Sunday");
      expect(resultDate.format("dddd")).toBe("Monday");

      // Should be Monday (Thursday + 3 days + 1 weekend day)
      const expectedDate = mockDay
        .add(deliveryDays + 1, "day")
        .format("dddd, MMMM D");
      expect(deliveryDate).toBe(expectedDate);
    });

    it("should not adjust delivery dates that fall on weekdays", () => {
      // Testing a delivery that falls on Friday
      const mockDay = dayjs("2023-07-18"); // Tuesday
      const deliveryDays = 3; // This would land on Friday (July 21)
      const mockOption = { deliveryDays, priceCents: 499 };

      const deliveryDate = calculateDeliveryDate(mockOption, mockDay);

      // Should be Friday (no adjustment needed)
      const expectedDate = mockDay
        .add(deliveryDays, "day")
        .format("dddd, MMMM D");
      expect(deliveryDate).toBe(expectedDate);
      expect(deliveryDate).toContain("Friday");
    });

    it("should format the returned date correctly", () => {
      // Test logic here verifying format is "dddd, MMMM D"
      // Test with different dates to ensure consistent formatting
      const testDates = [
        dayjs("2023-01-01"), // January
        dayjs("2023-06-15"), // June
        dayjs("2023-12-25"), // December
      ];

      for (const testDate of testDates) {
        // Use a simple delivery option
        const option = { deliveryDays: 2, priceCents: 0 };

        // Calculate delivery date using our test date
        const deliveryDate = calculateDeliveryDate(option, testDate);

        // Check format matches "dddd, MMMM D" (day of week, month name, day)
        expect(deliveryDate).toMatch(/^[A-Z][a-z]+, [A-Z][a-z]+ \d{1,2}$/);

        // Verify the format without checking the exact date
        // This just confirms the date is formatted properly
        expect(deliveryDate.split(" ").length).toBe(3);
        expect(deliveryDate.includes(",")).toBe(true);
      }
    });
  });
});
