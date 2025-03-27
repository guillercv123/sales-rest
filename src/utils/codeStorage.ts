const codeMap = new Map<string, string>();

export const storeCode = (email: string, code: string) => {
    codeMap.set(email, code);
    setTimeout(() => codeMap.delete(email), 5 * 60 * 1000); // 5 minutos
};

export const validateCode = (email: string, code: string): boolean => {
    const storedCode = codeMap.get(email);
    return storedCode === code;
};
