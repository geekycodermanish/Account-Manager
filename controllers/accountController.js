const db = require("../config/Sequalize");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { sendEmail } = require('../utils/sendEmail');
const {createAccountSchema, validateUpdateAccount } = require('../utils/validators');

exports.createAccount = async (req, res) => {
    try {
        const { error, value } = createAccountSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }

        const { first_name, last_name, email, phone, password, birthday } = value;

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingAccount = await db.Account.findOne({ where: { email } });
        if (existingAccount) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const birthdayDate = new Date(birthday);

        const newAccount = await db.Account.create({
            first_name,
            last_name,
            email,
            phone,
            password: hashedPassword,
            birthday: birthdayDate,
            created_at: new Date(),
            last_modified: new Date()
        });

        if(newAccount){

            let mailtext = `Your account has been successfully created.
            your user ID is : ${email}
            Password id : ${password}`
            await sendEmail(email, 'Account Created', mailtext);
        }


        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAccounts = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    try {
        const accounts = await db.Account.findAll({ limit });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await db.Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = validateUpdateAccount(req.body);

        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }

        const { first_name, last_name, email, phone, birthday } = value;

        const account = await db.Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        account.first_name = first_name || account.first_name;
        account.last_name = last_name || account.last_name;
        account.email = email || account.email;
        account.phone = phone || account.phone;
        account.birthday = birthday || account.birthday;
        account.last_modified = new Date();

        await account.save();
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await db.Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        await account.destroy();
        res.status(204).send("User Deleted...");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await db.Account.findOne({ where: { email } });
        if (!account) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
