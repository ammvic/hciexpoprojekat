const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const express = require('express');
const multer = require('multer');
const path = require('path');


// Konfiguracija za čuvanje fajlova
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Funkcija za slanje verifikacionog emaila
const sendVerificationEmail = async (user) => {
  try {
    const verificationToken = crypto.randomBytes(4).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'roomrover11@gmail.com',
        pass: 'uafslvnipomhpswd',
      },
    });

    const mailOptions = {
      from: 'roomrover11@gmail.com',
      to: user.email,
      subject: 'Verifikacija naloga',
      text: `Vaš verifikacioni kod je: ${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verifikacioni email je uspešno poslat');
  } catch (error) {
    console.error('Greška pri slanju verifikacionog emaila:', error);
    throw new Error('Greška pri slanju verifikacionog emaila.');
  }
};

// Funkcija za upload slike
const uploadProfilePic = async (req, res) => {
  try {
    const filePath = req.file.path;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    user.profilePic = filePath; // Ažuriranje putanje slike u bazi
    await user.save();

    res.status(200).json({ message: 'Slika uspešno postavljena', filePath });
  } catch (error) {
    res.status(500).json({ message: 'Greška prilikom postavljanja slike', error });
  }
};

const registerUser = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Dodaj ovo da vidiš sadržaj req.body

    const { email, password } = req.body;
    console.log('Request body:', req.body);
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email već postoji.' });
    }
    console.log('Request body:', req.body);
    // Proveri da li je password definisan
    if (!password) {
      return res.status(400).json({ message: 'Lozinka nije navedena.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ email, password: hashedPassword });
    await user.save();

    await sendVerificationEmail(user);

    res.status(200).json({ success: true, message: 'Registracija uspešna. Proverite vaš email za verifikaciju.' });
  } catch (error) {
    console.error('Greška u registraciji:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};


// Funkcija za verifikaciju emaila
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Nevažeći kod.' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email uspešno potvrđen. Sada se možete prijaviti.' });
  } catch (error) {
    console.error('Greška pri verifikaciji emaila:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};

// Funkcija za prijavu korisnika
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Neispravan email ili lozinka.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Neispravan email ili lozinka.' });
    }

    if (!user.verified) {
      return res.status(400).json({ message: 'Molimo vas potvrdite vaš email.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, user: { email: user.email } });
  } catch (error) {
    console.error('Greška pri prijavljivanju:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};

// Funkcija za ažuriranje korisničkih podataka
const updateUser = async (req, res) => {
  try {
    // Pribavljamo userId iz URL parametara
    const { userId } = req.params;

    // Pribavljamo podatke iz tela zahteva
    const { firstName, lastName, address, email, password } = req.body;

    // Pronalazimo korisnika prema userId
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Ažuriramo podatke korisnika
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;
    if (email) user.email = email;

    // Ako je lozinka prisutna, ažuriramo je nakon hashiranja
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Čuvamo izmene u bazi
    await user.save();
    res.status(200).json({ success: true, message: 'Podaci su uspešno ažurirani.' });
  } catch (error) {
    console.error('Greška pri ažuriranju korisničkih podataka:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Vraćamo podatke korisnika, osim lozinke
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka korisnika:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};
const getUserAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Vraćamo samo adresu korisnika
    res.status(200).json({
      address: user.address,
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju adrese korisnika:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};
const resetPassword = async (req, res) =>  {
  const { email, password } = req.body;

  try {
    // Pronađi korisnika po emailu
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Hashuj novu lozinku
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Ažuriraj lozinku u bazi
    user.passwordHash = hashedPassword; // Pretpostavljam da imaš ovo polje
    await user.save();

    res.status(200).json({ message: 'Lozinka uspešno promenjena.' });
  } catch (error) {
    console.error('Greška pri resetovanju lozinke:', error);
    res.status(500).json({ message: 'Došlo je do greške.', error: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  uploadProfilePic,
  updateUser,
  upload,
  getUserData,
  getUserAddress,
  resetPassword,
};
