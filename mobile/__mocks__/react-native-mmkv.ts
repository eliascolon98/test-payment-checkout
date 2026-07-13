type MockMMKV = {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  remove: (key: string) => void;
};

export const createMMKV = (): MockMMKV => {
  const store = new Map<string, string>();
  return {
    set: (key, value) => {
      store.set(key, value);
    },
    getString: (key) => store.get(key),
    remove: (key) => {
      store.delete(key);
    },
  };
};
