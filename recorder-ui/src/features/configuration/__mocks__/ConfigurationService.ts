import testSchedule from "../test-assets/231ab28d-a442-4a78-8efb-9220bf01e933.json";
export const getConfigurations = jest.fn(async () => {});

export const getConfiguration = jest.fn(async (id: string) =>
  Promise.resolve(testSchedule)
);
