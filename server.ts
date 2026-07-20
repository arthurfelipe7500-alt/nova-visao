import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data_store.json");

app.use(express.json());

// Initialize Data Store structure
interface User {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "SELLER" | "CLIENT";
  password?: string;
  avatar?: string;
  email: string;
  isApproved: boolean; // Sellers must be approved by Admin
  balance?: number; // for sellers
}

interface Property {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  price: number;
  currency: string;
  type: "COMPRA" | "ALUGUEL";
  isMonthly?: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  sellerId: string;
  sellerName: string;
  coordinates: { lat: number; lng: number };
  amenities: {
    schools: string;
    pharmacies: string;
    airports: string;
    metro: string;
    supermarket: string;
    hospital: string;
  };
  rooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  tour3d: string[]; // List of room names
  rating: number;
  reviewsCount: number;
}

interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userRole: string;
  rating: number;
  comment: string;
  date: string;
}

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  propertyTitle: string;
  propertyId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

interface Notification {
  id: string;
  userId: string; // Target user
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

interface DataStore {
  users: User[];
  properties: Property[];
  reviews: Review[];
  chats: Chat[];
  favorites: Record<string, string[]>; // userId -> propertyIds[]
  notifications: Notification[];
}

let db: DataStore = {
  users: [],
  properties: [],
  reviews: [],
  chats: [],
  favorites: {},
  notifications: []
};

// Seed initial state helper
function seedData() {
  const initialUsers: User[] = [
    {
      id: "admin-1",
      username: "admin",
      name: "Administrador Geral",
      role: "ADMIN",
      password: "sofialinda00",
      email: "admin@novavisao.pro",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "seller-1",
      username: "pedro_luxury",
      name: "Pedro Silva",
      role: "SELLER",
      password: "123",
      email: "pedro@novavisao.pro",
      isApproved: true,
      balance: 145000,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "seller-2",
      username: "sofia_broker",
      name: "Sofia Alencar",
      role: "SELLER",
      password: "123",
      email: "sofia.a@novavisao.pro",
      isApproved: false, // Pending admin approval to demonstrate admin features
      balance: 0,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "client-1",
      username: "user",
      name: "Arthur Felipe",
      role: "CLIENT",
      password: "user123",
      email: "arthurfelipe7500@gmail.com",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
    }
  ];

  const initialProperties: Property[] = [
    {
      id: "prop-1",
      title: "Solar Imperial de Sintra",
      description: "Espetacular solar histórico do século XIX inteiramente restaurado com o mais refinado luxo contemporâneo. Localizado aos pés do Castelo dos Mouros, dispõe de adega subterrânea, piscina aquecida de borda infinita, pomares privativos, salão de baile e teto adornado com afrescos originais folheados a ouro.",
      country: "Portugal",
      city: "Sintra",
      price: 2850000,
      currency: "EUR",
      type: "COMPRA",
      status: "APPROVED",
      sellerId: "seller-1",
      sellerName: "Pedro Silva",
      coordinates: { lat: 38.7994, lng: -9.3872 },
      amenities: {
        schools: "1.4 km (Escola Internacional de Sintra)",
        pharmacies: "0.4 km (Farmácia Central)",
        airports: "26.5 km (Aeroporto Humberto Delgado Lisboa)",
        metro: "1.1 km (Estação Ferroviária de Sintra)",
        supermarket: "0.7 km (Mercado Gourmet Pingo Doce)",
        hospital: "3.2 km (Hospital CUF Sintra)"
      },
      rooms: 6,
      bathrooms: 8,
      area: 680,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600"
      ],
      tour3d: ["Hall Imperial", "Salão Nobre", "Adega Privativa", "Terraço dos Mouros"],
      rating: 4.9,
      reviewsCount: 3
    },
    {
      id: "prop-2",
      title: "Cobertura Duplex Esmeralda Ipanema",
      description: "Cobertura de alto padrão cinematográfica com vista frontal definitiva e deslumbrante para a praia de Ipanema. O imóvel possui projeto de iluminação assinado, piscina aquecida em deck suspenso com borda de vidro, churrasqueira, suíte master com hidro e acabamentos modernos em mármore importado e detalhes dourados reluzentes.",
      country: "Brasil",
      city: "Rio de Janeiro",
      price: 18500000,
      currency: "BRL",
      type: "COMPRA",
      status: "APPROVED",
      sellerId: "seller-1",
      sellerName: "Pedro Silva",
      coordinates: { lat: -22.9836, lng: -43.2065 },
      amenities: {
        schools: "0.6 km (Colégio Santo Agostinho)",
        pharmacies: "0.1 km (Drogaria Raia Ipanema)",
        airports: "11.2 km (Aeroporto Santos Dumont)",
        metro: "0.3 km (Estação General Osório)",
        supermarket: "0.4 km (Zona Sul Premium)",
        hospital: "2.1 km (Hospital Copa Star)"
      },
      rooms: 4,
      bathrooms: 6,
      area: 420,
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600"
      ],
      tour3d: ["Terraço de Vidro", "Living Integrado", "Cozinha Gourmet", "Suíte Master"],
      rating: 5.0,
      reviewsCount: 2
    },
    {
      id: "prop-3",
      title: "The Golden Ribbon Penthouse",
      description: "Apartamento duplex localizado no topo de arranha-céu luxuoso adjacente ao Central Park. Pé-direito duplo imponente, janelas do chão ao teto de alta resistência, automação residencial total por voz, cozinha profissional de chef e móveis sob medida com detalhes folheados a ouro 24k.",
      country: "EUA",
      city: "Nova York",
      price: 24000,
      currency: "USD",
      type: "ALUGUEL",
      isMonthly: true,
      status: "APPROVED",
      sellerId: "seller-1",
      sellerName: "Pedro Silva",
      coordinates: { lat: 40.7580, lng: -73.9855 },
      amenities: {
        schools: "0.8 km (The Browning School)",
        pharmacies: "0.1 km (Duane Reade Broadway)",
        airports: "16.8 km (LaGuardia Airport)",
        metro: "0.1 km (Times Square - 42nd St Station)",
        supermarket: "0.5 km (Whole Foods Market)",
        hospital: "1.9 km (Mount Sinai West)"
      },
      rooms: 3,
      bathrooms: 4,
      area: 290,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1545464693-f1798a373343?auto=format&fit=crop&q=80&w=600"
      ],
      tour3d: ["Skyline Living", "Cozinha Chef", "Quarto Panorâmico"],
      rating: 4.8,
      reviewsCount: 1
    },
    {
      id: "prop-4",
      title: "Mansão Tradicional Zen Quioto",
      description: "Uma obra-prima arquitetônica que une o design zen tradicional japonês ao mais alto luxo ocidental. Possui um autêntico jardim de rochas de contemplação, tatames artesanais selecionados, uma sala de chá exclusiva com vista para o bosque de bambus, e um banho termal onsen privativo esculpido em rocha vulcânica natural.",
      country: "Japão",
      city: "Quioto",
      price: 490000000,
      currency: "JPY",
      type: "COMPRA",
      status: "APPROVED",
      sellerId: "seller-1",
      sellerName: "Pedro Silva",
      coordinates: { lat: 35.0116, lng: 135.7681 },
      amenities: {
        schools: "1.8 km (Kyoto International School)",
        pharmacies: "0.3 km (Sugi Pharmacy)",
        airports: "48.2 km (Osaka Itami Airport)",
        metro: "0.8 km (Estação de Quioto)",
        supermarket: "0.5 km (Fresco Premium)",
        hospital: "2.4 km (Kyoto University Hospital)"
      },
      rooms: 5,
      bathrooms: 5,
      area: 550,
      images: [
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600"
      ],
      tour3d: ["Jardim de contemplação", "Sala de Chá", "Onsen Termal"],
      rating: 4.9,
      reviewsCount: 1
    },
    {
      id: "prop-5",
      title: "Residência Marina Heights Marina",
      description: "Apartamento espetacular em andar altíssimo na icônica Dubai Marina. Dispõe de elevador privativo blindado com leitor facial, heliponto no edifício, varanda panorâmica com jacuzzi infinita projetada sobre a Palm Jumeirah e serviço completo de concierge 24 horas por dia.",
      country: "Emirados Árabes",
      city: "Dubai",
      price: 45000,
      currency: "AED",
      type: "ALUGUEL",
      isMonthly: true,
      status: "APPROVED",
      sellerId: "seller-2",
      sellerName: "Sofia Alencar",
      coordinates: { lat: 25.0805, lng: 55.1403 },
      amenities: {
        schools: "1.1 km (Dubai British School)",
        pharmacies: "0.2 km (Aster Pharmacy Marina)",
        airports: "28.4 km (Dubai International Airport)",
        metro: "0.4 km (DMCC Metro Station)",
        supermarket: "0.3 km (Spinneys Supermarket)",
        hospital: "3.5 km (Saudi German Hospital)"
      },
      rooms: 4,
      bathrooms: 5,
      area: 360,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&q=80&w=600"
      ],
      tour3d: ["Living Principal", "Varanda Panorâmica", "Cinema Privativo"],
      rating: 4.7,
      reviewsCount: 2
    },
    {
      id: "prop-6",
      title: "Chalet de l'Or Blanc (Ouro Branco)",
      description: "Chalet alpino luxuoso na exclusiva estação de esqui de St. Moritz. Construído em madeira maciça nobre tratada e pedras glaciais, possui acesso 'ski-in/ski-out' direto às pistas olímpicas, lareira suspensa rotativa, adega climatizada de vinhos raros, piscina aquecida interna e sauna de vidro.",
      country: "Suíça",
      city: "St. Moritz",
      price: 21500000,
      currency: "CHF",
      type: "COMPRA",
      status: "PENDING", // Pending for Admin Approval Demonstration
      sellerId: "seller-2",
      sellerName: "Sofia Alencar",
      coordinates: { lat: 46.4908, lng: 9.8355 },
      amenities: {
        schools: "3.5 km (Lyceum Alpinum Zuoz)",
        pharmacies: "0.8 km (Apotheke St. Moritz)",
        airports: "145 km (Zurich International Airport)",
        metro: "1.2 km (Estação Ferroviária RhB)",
        supermarket: "0.9 km (Coop Supermarket)",
        hospital: "2.8 km (Klinik Gut St. Moritz)"
      },
      rooms: 7,
      bathrooms: 7,
      area: 840,
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"
      ],
      tour3d: ["Salão da Lareira", "Piscina Coberta", "Suíte Presidencial", "Adega de Vidro"],
      rating: 5.0,
      reviewsCount: 1
    }
  ];

  const initialReviews: Review[] = [
    {
      id: "rev-1",
      propertyId: "prop-1",
      userName: "Alexandre Dumas",
      userRole: "CLIENT",
      rating: 5,
      comment: "Lugar absolutamente fantástico. O restauro preservou a alma histórica do castelo com toda a modernidade necessária para conforto. Recomendadíssimo!",
      date: "2026-05-15"
    },
    {
      id: "rev-2",
      propertyId: "prop-1",
      userName: "Helena de Tróia",
      userRole: "CLIENT",
      rating: 5,
      comment: "A vista para o Castelo dos Mouros ao amanhecer é algo inexplicável. A imobiliária foi extremamente prestativa durante o processo de agendamento.",
      date: "2026-06-02"
    },
    {
      id: "rev-3",
      propertyId: "prop-2",
      userName: "Roberto Carlos",
      userRole: "CLIENT",
      rating: 5,
      comment: "Verdadeiramente espetacular. Acordar de frente para o mar de Ipanema nessa cobertura é viver no paraíso. A piscina suspensa com borda de vidro é um show à parte.",
      date: "2026-07-01"
    }
  ];

  const initialChats: Chat[] = [
    {
      id: "chat-1",
      clientId: "client-1",
      clientName: "Arthur Felipe",
      sellerId: "seller-1",
      sellerName: "Pedro Silva",
      propertyTitle: "Solar Imperial de Sintra",
      propertyId: "prop-1",
      updatedAt: "2026-07-20T08:15:00.000Z",
      messages: [
        {
          senderId: "client-1",
          senderName: "Arthur Felipe",
          text: "Olá Pedro! Gostaria de saber se o Solar Imperial de Sintra já possui mobília ou se é entregue vazio.",
          timestamp: "2026-07-20T08:10:00.000Z"
        },
        {
          senderId: "seller-1",
          senderName: "Pedro Silva",
          text: "Olá Arthur! Excelente pergunta. O Solar é vendido totalmente mobiliado com as peças históricas catalogadas e móveis contemporâneos sob medida que estão nas imagens. Deseja agendar uma visita presencial ou um tour virtual guiado?",
          timestamp: "2026-07-20T08:15:00.000Z"
        }
      ]
    }
  ];

  const initialNotifications: Notification[] = [
    {
      id: "notif-1",
      userId: "seller-1",
      title: "Anúncio Aprovado",
      body: "Seu imóvel 'Solar Imperial de Sintra' foi analisado e aprovado com sucesso pela moderação administrativa.",
      timestamp: "2026-07-19T14:30:00.000Z",
      read: false
    },
    {
      id: "notif-2",
      userId: "seller-1",
      title: "Nova Mensagem",
      body: "Você tem uma nova mensagem de Arthur Felipe sobre 'Solar Imperial de Sintra'.",
      timestamp: "2026-07-20T08:10:00.000Z",
      read: true
    }
  ];

  db = {
    users: initialUsers,
    properties: initialProperties,
    reviews: initialReviews,
    chats: initialChats,
    favorites: {
      "client-1": ["prop-1", "prop-2"]
    },
    notifications: initialNotifications
  };

  saveStore();
}

function loadStore() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      db = JSON.parse(content);
      console.log("Data store loaded from", DATA_FILE);
    } catch (e) {
      console.error("Failed to parse data store, seeding new state", e);
      seedData();
    }
  } else {
    console.log("No data store found. Seeding initial data...");
    seedData();
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write data store:", e);
  }
}

// Initial Load
loadStore();

// APIs
// Auth login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Preencha usuário e senha." });
  }

  const user = db.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Usuário ou senha inválidos." });
  }

  if (user.role === "SELLER" && !user.isApproved) {
    return res.status(403).json({ error: "Sua conta de Vendedor está aguardando aprovação do administrador." });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// Auth register
app.post("/api/auth/register", (req, res) => {
  const { username, password, name, email, role } = req.body;
  if (!username || !password || !name || !email || !role) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const existing = db.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return res.status(400).json({ error: "Nome de usuário ou e-mail já cadastrado." });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    name,
    role,
    password,
    email,
    isApproved: role === "CLIENT" || role === "ADMIN", // Sellers must be approved
    avatar: `https://images.unsplash.com/photo-${role === "SELLER" ? "1472099645785-5658abf4ff4e" : "1535713875002-d1d0cf377fde"}?auto=format&fit=crop&q=80&w=120`,
    balance: role === "SELLER" ? 0 : undefined
  };

  db.users.push(newUser);
  saveStore();

  // Notify admin if a seller registers
  if (role === "SELLER") {
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: "admin-1",
      title: "Novo Vendedor Registrado",
      body: `O corretor/vendedor ${name} criou uma conta e aguarda aprovação.`,
      timestamp: new Date().toISOString(),
      read: false
    });
    saveStore();
  }

  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, message: role === "SELLER" ? "Cadastro realizado! Aguarde aprovação do administrador." : "Cadastro concluído com sucesso!" });
});

// Get properties (all active or customized search)
app.get("/api/properties", (req, res) => {
  const { query, country, type, minPrice, maxPrice, rooms, sellerId, status } = req.query;

  let list = db.properties;

  // Filter based on parameters
  if (sellerId) {
    list = list.filter((p) => p.sellerId === sellerId);
  } else {
    // Standard guests see only approved properties unless filtered for admin
    if (status) {
      list = list.filter((p) => p.status === status);
    } else {
      list = list.filter((p) => p.status === "APPROVED");
    }
  }

  if (country) {
    list = list.filter((p) => p.country.toLowerCase() === (country as string).toLowerCase());
  }

  if (type) {
    list = list.filter((p) => p.type === type);
  }

  if (minPrice) {
    list = list.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }

  if (rooms) {
    list = list.filter((p) => p.rooms >= Number(rooms));
  }

  if (query) {
    const q = (query as string).toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

// Get single property details
app.get("/api/properties/:id", (req, res) => {
  const prop = db.properties.find((p) => p.id === req.params.id);
  if (!prop) {
    return res.status(404).json({ error: "Imóvel não encontrado." });
  }
  const reviews = db.reviews.filter((r) => r.propertyId === req.params.id);
  res.json({ property: prop, reviews });
});

// Create property listing (Seller)
app.post("/api/properties", (req, res) => {
  const { title, description, country, city, price, currency, type, isMonthly, coordinates, amenities, rooms, bathrooms, area, images, sellerId, sellerName } = req.body;

  if (!title || !description || !country || !city || !price || !currency || !type || !sellerId) {
    return res.status(400).json({ error: "Campos obrigatórios não informados." });
  }

  const newProp: Property = {
    id: `prop-${Date.now()}`,
    title,
    description,
    country,
    city,
    price: Number(price),
    currency,
    type,
    isMonthly: !!isMonthly,
    status: "PENDING", // Must be approved by Admin
    sellerId,
    sellerName,
    coordinates: coordinates || { lat: -22.9068, lng: -43.1729 },
    amenities: amenities || {
      schools: "0.5 km (Escola Local)",
      pharmacies: "0.4 km (Farmácia de Bairro)",
      airports: "15 km (Aeroporto Regional)",
      metro: "1.0 km (Estação Integrada)",
      supermarket: "0.3 km (Mercado Central)",
      hospital: "2.0 km (Upa Próxima)"
    },
    rooms: Number(rooms || 2),
    bathrooms: Number(bathrooms || 2),
    area: Number(area || 80),
    images: images && images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200"
    ],
    tour3d: ["Sala de Estar", "Cozinha", "Suíte Principal", "Varanda Gourmet"],
    rating: 5.0,
    reviewsCount: 0
  };

  db.properties.push(newProp);

  // Notify administrator of new property pending approval
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: "admin-1",
    title: "Novo Imóvel Cadastrado",
    body: `O vendedor ${sellerName} cadastrou '${title}' e aguarda aprovação de preço e publicação.`,
    timestamp: new Date().toISOString(),
    read: false
  });

  saveStore();
  res.status(201).json({ property: newProp, message: "Imóvel cadastrado com sucesso! Ele ficará ativo após aprovação administrativa." });
});

// Admin Approve / Reject Listing
app.patch("/api/properties/:id/status", (req, res) => {
  const { status, price } = req.body; // status: APPROVED or REJECTED
  const prop = db.properties.find((p) => p.id === req.params.id);

  if (!prop) {
    return res.status(404).json({ error: "Imóvel não encontrado." });
  }

  prop.status = status;
  if (price) {
    prop.price = Number(price);
  }

  // Notify seller
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: prop.sellerId,
    title: status === "APPROVED" ? "Imóvel Aprovado!" : "Imóvel Rejeitado",
    body: status === "APPROVED" 
      ? `Seu imóvel '${prop.title}' foi aprovado para publicação com o valor de ${prop.price.toLocaleString()} ${prop.currency}.` 
      : `O anúncio '${prop.title}' não foi aprovado pela administração.`,
    timestamp: new Date().toISOString(),
    read: false
  });

  saveStore();
  res.json({ property: prop, message: `Status do imóvel atualizado para ${status}.` });
});

// Admin Approve Seller Account
app.patch("/api/admin/sellers/:id/approve", (req, res) => {
  const seller = db.users.find((u) => u.id === req.params.id && u.role === "SELLER");
  if (!seller) {
    return res.status(404).json({ error: "Vendedor não encontrado." });
  }

  seller.isApproved = true;

  // Add a welcoming notification for seller
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: seller.id,
    title: "Conta Ativada com Sucesso!",
    body: "Parabéns, seu cadastro como profissional de vendas foi aprovado por nossa equipe administrativa! Você já pode publicar imóveis.",
    timestamp: new Date().toISOString(),
    read: false
  });

  saveStore();
  res.json({ seller, message: "Vendedor aprovado com sucesso!" });
});

// Toggle Favorite
app.post("/api/properties/:id/favorite", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Usuário não autenticado." });
  }

  if (!db.favorites[userId]) {
    db.favorites[userId] = [];
  }

  const index = db.favorites[userId].indexOf(req.params.id);
  let isFavorite = false;

  if (index === -1) {
    db.favorites[userId].push(req.params.id);
    isFavorite = true;
  } else {
    db.favorites[userId].splice(index, 1);
  }

  saveStore();
  res.json({ favorites: db.favorites[userId], isFavorite });
});

// Get user favorites
app.get("/api/users/:userId/favorites", (req, res) => {
  const favIds = db.favorites[req.params.userId] || [];
  const list = db.properties.filter((p) => favIds.includes(p.id) && p.status === "APPROVED");
  res.json(list);
});

// Post a Review / Rating
app.post("/api/properties/:id/reviews", (req, res) => {
  const { userName, rating, comment, userRole } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: "Preencha todos os campos da avaliação." });
  }

  const prop = db.properties.find((p) => p.id === req.params.id);
  if (!prop) {
    return res.status(404).json({ error: "Imóvel não encontrado." });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    propertyId: req.params.id,
    userName,
    userRole: userRole || "CLIENT",
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split("T")[0]
  };

  db.reviews.push(newReview);

  // Recalculate property ratings
  const propReviews = db.reviews.filter((r) => r.propertyId === prop.id);
  const total = propReviews.reduce((sum, r) => sum + r.rating, 0);
  prop.rating = Number((total / propReviews.length).toFixed(1));
  prop.reviewsCount = propReviews.length;

  // Send a notification to the seller about the review
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: prop.sellerId,
    title: "Nova Avaliação Recebida",
    body: `Seu imóvel '${prop.title}' recebeu uma nota ${rating}/5 de ${userName}.`,
    timestamp: new Date().toISOString(),
    read: false
  });

  saveStore();
  res.status(201).json({ review: newReview, property: prop });
});

// List or Create Chats
app.get("/api/chats", (req, res) => {
  const { userId, role } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Id do usuário é obrigatório." });
  }

  let userChats = db.chats;
  if (role === "SELLER") {
    userChats = db.chats.filter((c) => c.sellerId === userId);
  } else if (role === "CLIENT") {
    userChats = db.chats.filter((c) => c.clientId === userId);
  }

  res.json(userChats);
});

// Create a chat session or return existing
app.post("/api/chats", (req, res) => {
  const { clientId, clientName, sellerId, sellerName, propertyId, propertyTitle } = req.body;

  if (!clientId || !sellerId || !propertyId) {
    return res.status(400).json({ error: "Faltando parâmetros de criação de chat." });
  }

  // Check if chat already exists for this property, client and seller
  const existing = db.chats.find(
    (c) => c.clientId === clientId && c.sellerId === sellerId && c.propertyId === propertyId
  );

  if (existing) {
    return res.json(existing);
  }

  const newChat: Chat = {
    id: `chat-${Date.now()}`,
    clientId,
    clientName,
    sellerId,
    sellerName,
    propertyTitle,
    propertyId,
    updatedAt: new Date().toISOString(),
    messages: [
      {
        senderId: "seller-1",
        senderName: "Sistema",
        text: `Olá! Você iniciou uma conversa com ${sellerName} sobre o imóvel "${propertyTitle}". Envie sua mensagem e responderemos em instantes.`,
        timestamp: new Date().toISOString()
      }
    ]
  };

  db.chats.push(newChat);
  saveStore();
  res.status(201).json(newChat);
});

// Post a Message & Simulate instant Broker reply
app.post("/api/chats/:id/messages", (req, res) => {
  const { senderId, senderName, text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "A mensagem não pode ser vazia." });
  }

  const chat = db.chats.find((c) => c.id === req.params.id);
  if (!chat) {
    return res.status(404).json({ error: "Conversa não encontrada." });
  }

  const userMsg: ChatMessage = {
    senderId,
    senderName,
    text,
    timestamp: new Date().toISOString()
  };

  chat.messages.push(userMsg);
  chat.updatedAt = new Date().toISOString();

  // Create a notification for the other participant
  const targetUserId = senderId === chat.clientId ? chat.sellerId : chat.clientId;
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: targetUserId,
    title: `Nova mensagem de ${senderName}`,
    body: text.length > 50 ? text.substring(0, 47) + "..." : text,
    timestamp: new Date().toISOString(),
    read: false
  });

  // Simulated Professional Reply (if client is talking to broker)
  if (senderId === chat.clientId) {
    const brokerResponses = [
      "Perfeito! Vou verificar os horários de visita disponíveis para este imóvel e já te retorno com as opções.",
      "Excelente escolha. Esse imóvel possui acabamentos de primeiríssima linha. Gostaria de receber a planta completa e a relação de taxas?",
      "Com certeza! O proprietário está aberto a propostas. Você gostaria de agendar uma chamada de vídeo para conversarmos em detalhes?",
      "Olá! Entendi perfeitamente sua dúvida. Esse imóvel está localizado em uma das regiões mais valorizadas e seguras. Posso te enviar fotos adicionais pelo WhatsApp?",
      "Excelente. O tour 3D no nosso site já te dá uma ótima perspectiva. Vamos marcar uma visita presencial nesta semana?"
    ];

    const randomResponse = brokerResponses[Math.floor(Math.random() * brokerResponses.length)];

    // Add a small simulated delay in the chat message
    setTimeout(() => {
      const systemReply: ChatMessage = {
        senderId: chat.sellerId,
        senderName: chat.sellerName,
        text: randomResponse,
        timestamp: new Date().toISOString()
      };
      chat.messages.push(systemReply);
      chat.updatedAt = new Date().toISOString();
      saveStore();
    }, 1500);
  }

  saveStore();
  res.status(201).json(chat);
});

// Notifications
app.get("/api/notifications", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Faltando userId." });
  const list = db.notifications.filter((n) => n.userId === userId);
  res.json(list);
});

app.post("/api/notifications/read-all", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Faltando userId." });
  db.notifications.forEach((n) => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  saveStore();
  res.json({ success: true });
});

// Admin Sellers Endpoint
app.get("/api/admin/sellers", (req, res) => {
  const sellers = db.users.filter((u) => u.role === "SELLER");
  res.json(sellers);
});

// Admin Performance and Reports endpoint
app.get("/api/admin/reports", (req, res) => {
  const activeSellers = db.users.filter((u) => u.role === "SELLER" && u.isApproved).length;
  const pendingSellers = db.users.filter((u) => u.role === "SELLER" && !u.isApproved).length;
  
  const approvedListings = db.properties.filter((p) => p.status === "APPROVED").length;
  const pendingListings = db.properties.filter((p) => p.status === "PENDING").length;
  const rejectedListings = db.properties.filter((p) => p.status === "REJECTED").length;

  const totalPropertiesValue = db.properties
    .filter((p) => p.status === "APPROVED" && p.type === "COMPRA")
    .reduce((sum, p) => {
      // Basic mock normalization to EUR for scale
      let coef = 1;
      if (p.currency === "BRL") coef = 0.17;
      if (p.currency === "USD") coef = 0.92;
      if (p.currency === "JPY") coef = 0.006;
      if (p.currency === "AED") coef = 0.25;
      if (p.currency === "CHF") coef = 1.05;
      return sum + p.price * coef;
    }, 0);

  // Simulated statistics
  const data = {
    summary: {
      globalVolumeEUR: Math.round(totalPropertiesValue),
      commissionRate: "5%",
      estimatedCommissionEUR: Math.round(totalPropertiesValue * 0.05),
      averageRating: 4.88,
      activeSellers,
      pendingSellers,
      approvedListings,
      pendingListings,
      rejectedListings
    },
    monthlyPerformance: [
      { month: "Jan", vendas: 4500000, alugueis: 120000 },
      { month: "Fev", vendas: 5800000, alugueis: 140000 },
      { month: "Mar", vendas: 8200000, alugueis: 180000 },
      { month: "Abr", vendas: 7100000, alugueis: 165000 },
      { month: "Mai", vendas: 9400000, alugueis: 210000 },
      { month: "Jun", vendas: 12500000, alugueis: 250000 },
      { month: "Jul", vendas: Math.round(totalPropertiesValue * 0.4), alugueis: 290000 }
    ],
    listingsByCountry: [
      { country: "Portugal", count: db.properties.filter((p) => p.country === "Portugal").length },
      { country: "Brasil", count: db.properties.filter((p) => p.country === "Brasil").length },
      { country: "EUA", count: db.properties.filter((p) => p.country === "EUA").length },
      { country: "Japão", count: db.properties.filter((p) => p.country === "Japão").length },
      { country: "Emirados Árabes", count: db.properties.filter((p) => p.country === "Emirados Árabes").length },
      { country: "Suíça", count: db.properties.filter((p) => p.country === "Suíça").length }
    ]
  };

  res.json(data);
});

// Stripe checkout / payment gateway simulator
app.post("/api/payments/checkout", (req, res) => {
  const { propertyId, userId, cardName, cardNumber, country, amount, currency } = req.body;

  if (!propertyId || !userId || !cardName || !cardNumber) {
    return res.status(400).json({ error: "Faltando dados de pagamento." });
  }

  const prop = db.properties.find((p) => p.id === propertyId);
  if (!prop) {
    return res.status(404).json({ error: "Imóvel correspondente não encontrado." });
  }

  // Generate success transaction ID
  const transactionId = `txn_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

  // Notify seller of a successful offer or transaction!
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: prop.sellerId,
    title: "Proposta Aprovada & Sinal Pago!",
    body: `Excelente! O cliente ${cardName} efetuou a reserva/sinal do imóvel '${prop.title}' no valor de ${Number(amount).toLocaleString()} ${currency}. Transação: ${transactionId}`,
    timestamp: new Date().toISOString(),
    read: false
  });

  // Credit Seller's balance
  const seller = db.users.find((u) => u.id === prop.sellerId);
  if (seller) {
    if (seller.balance === undefined) seller.balance = 0;
    seller.balance += Math.round(Number(amount) * 0.05); // Credit 5% broker commission
  }

  saveStore();

  res.json({
    success: true,
    transactionId,
    message: "Pagamento do sinal e garantia de reserva realizado com sucesso pelo gateway Nova Visão SecurePay!",
    amount,
    currency
  });
});

// Serve Frontend using Vite Middleware in development, or Static build in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nova Visão Pro Server] Rodando em http://localhost:${PORT}`);
  });
}

startServer();
