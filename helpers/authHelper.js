import argon2 from 'argon2';

export const hashPassword = async (password) => {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (error) {
        console.error('Error comparing password:', error);
        return false;
    }
};
