import { Candidate, Commitment, Conversation } from '../types';

export const GLUE_LOGO = 'https://lh3.googleusercontent.com/aida/AEtjO1VyCIlnYeLhsxUyLaNWzHhM3nFhYAZRGuQMKEcPGdCwLjb_ugknGjrajPa1dQlpWUurAy-IhIGNIXZ8YpOtzXcRf7m0lMOukmlG_po0bmQ_GjjxDpXAe2HFReVEHOO-TtIFV7zYyMBTp67o9kS680Sr7LlRhx9ik6hA8t8H_qzDDmRN2vn9ttCPv8wZwNqtg1irfZ99IAWvPuwinYmhYMXi_6WiOTM1iXgwoD396czfUf7De2n_ra44qwuSFRUvOa2TZ6TPewLRMsI';

export const USER_AVATAR = 'https://lh3.googleusercontent.com/aida/AEtjO1WcLa1hicnP3j1cn4pRosGprQRE0f8BqycKChYawuVPlVIfHXoBivZWrGhuCWC2D1LtevOFd1sbifXh1HFxlUbwwI79XVD-l6M066RVuN6Nz-_Ktm_ekLs-036SvQ3BMpPicQP9DRIjFl8EtDKM5_GjATXYWQd3olyiMzZ7i2TuVrtd8YV4nWQ1_YU4PoU-N8Dki9S88WzYdeysooznLfdttocfeuL-6EaD7jh7jQUwQ7C90CboBjBSErXR';

export const CANDIDATES: Candidate[] = [
  {
    id: 'mariana-costa',
    name: 'Mariana Costa',
    age: 27,
    title: 'Art Director & Ceramicist',
    location: 'Vila Madalena',
    distance: '3km',
    activeNow: true,
    commitmentRate: 98,
    fulfilledCount: 14,
    protocolVerified: true,
    bio: '“Curating spaces and collecting rare vinyl. Only here for intentional dates over cortados or natural wine. No endless texting.”',
    vowRequirement: 2,
    vowVibeNote: 'Prefers cozy café or evening gallery walk',
    tags: ['Art History', 'Specialty Coffee', 'Architecture', 'Analog Film'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwZdUoGNeeCwFfCQWpuuVkEjlkpXsjpxk6y1Hx7fImKenk0d5_a3hRKO9LbdoK90Rlw26LXvFZN9GqWfjyXuhwjG00WzMNS1VjMga6diHdS9K_P55IpmD0Vf1btM_kz7IDwbSLSX68KG8ya2kjThChFgiY6BoBO7SaKdxeY2IQmUx_lw41NXR-YIV3aYSMN-GqZrHAG_mzQPZ-XG_qAXNWUbcZ7VjXFgZKo3bxY-8xoj3FNzTgqoKy9A',
    previewBio: '“Curating spaces and collecting rare vinyl...”',
    meetingVenue: 'Café Origami',
    meetingTime: '4:00 PM'
  },
  {
    id: 'camila-silveira',
    name: 'Camila Silveira',
    age: 29,
    title: 'Landscape Architect',
    location: 'Jardins',
    distance: '5km',
    activeNow: true,
    commitmentRate: 100,
    fulfilledCount: 18,
    protocolVerified: true,
    bio: '“Designing urban rooftop gardens and native flora sanctuaries. Looking for book swaps, botanical greenhouse visits, and passionate conversations.”',
    vowRequirement: 3,
    vowVibeNote: 'Prefers afternoon botanical garden walk or matcha bar',
    tags: ['Urban Ecology', 'Book Clubs', 'Espresso', 'Sustainable Cities'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUauG_NSriPc4CeEK9fDor-nUvxBKpST1pOXGaLByDZVFv49etlKlcmeya3lN5u8_rEJwjOKvflynetsSJavZkaP3OvcoIe4uZ0YZchwovSJMfUaR3vabr0Pb5NWa4fqw0V565ON_70j-J7axKYGESu-wh_e-ankf_gOZL2XZfSTT026J_Aqrqq9Et6wwLuv4MkPq36P6VS5j-CIabW-NILI58pSNXiazqMSuWEUSRBJyJHQl1LmdbTQ',
    previewBio: 'Looking for book swaps & architecture walks',
    meetingVenue: 'Café Jardin',
    meetingTime: '2:30 PM'
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    age: 28,
    title: 'Brand Strategist & Musician',
    location: 'Pinheiros',
    distance: '2km',
    activeNow: true,
    commitmentRate: 96,
    fulfilledCount: 10,
    protocolVerified: true,
    bio: '“Independent record producer and coffee obsessive. Believer in prompt arrivals and no digital ghosts.”',
    vowRequirement: 5,
    vowVibeNote: 'Prefers acoustic lounge or espresso bar',
    tags: ['Acoustic Vinyl', 'Modernist Design', 'Cold Brew', 'Cinema'],
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1X_h_Zxh9mc4eN-kxwT0uCu3XyTStvjy4hX_oG3XAJrxpEYv9ZOox-FzcMmUvd3pXvW-w0cPJp6-v74WMaRFVXcowrEdu1aEPxj7Q0NGbOR0MMi_Zzc8HE4NUkaZKTknTjvj_Dg2iPvPg-8x6Plr1099US4GN5SuDUJiyauGF3qw6aZWQrx7Fd_vQnXqo4ATbeAQwoEXPRV5qW6M0pOHP7bCBVMRsnjE0uHEAzxjex1OCXFpdajcoGMhDo',
    previewBio: 'Escrow committed for Café Gitane',
    meetingVenue: 'Café Gitane',
    meetingTime: '11:30 AM'
  },
  {
    id: 'mateo-bianchi',
    name: 'Mateo Bianchi',
    age: 31,
    title: 'Lighting Designer & Sound Artist',
    location: 'Itaim Bibi',
    distance: '4km',
    activeNow: false,
    commitmentRate: 94,
    fulfilledCount: 8,
    protocolVerified: true,
    bio: '“Sculpting atmospheric light installations. Interested in contemporary art biennial walks, natural wine, and honest intentions.”',
    vowRequirement: 2,
    vowVibeNote: 'Prefers evening exhibition preview or sake bar',
    tags: ['Installation Art', 'Ambient Sound', 'Natural Wine', 'Typography'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    previewBio: 'Looking for intentional dates in São Paulo',
    meetingVenue: 'Bar do Museu',
    meetingTime: '7:00 PM'
  }
];

export const INITIAL_COMMITMENT: Commitment = {
  id: 'commit-alex-01',
  candidateId: 'alex-rivera',
  candidateName: 'Alex Rivera',
  candidateAge: 28,
  candidateTitle: 'Brand Strategist & Musician',
  candidateImage: 'https://lh3.googleusercontent.com/aida/AEtjO1X_h_Zxh9mc4eN-kxwT0uCu3XyTStvjy4hX_oG3XAJrxpEYv9ZOox-FzcMmUvd3pXvW-w0cPJp6-v74WMaRFVXcowrEdu1aEPxj7Q0NGbOR0MMi_Zzc8HE4NUkaZKTknTjvj_Dg2iPvPg-8x6Plr1099US4GN5SuDUJiyauGF3qw6aZWQrx7Fd_vQnXqo4ATbeAQwoEXPRV5qW6M0pOHP7bCBVMRsnjE0uHEAzxjex1OCXFpdajcoGMhDo',
  venue: 'Café Gitane',
  time: '11:30 AM',
  userCode: '4827',
  partnerCode: '6319',
  vowsStaked: 5,
  status: 'escrowed',
  createdAt: 'Today, 10:00 AM'
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-alex',
    candidateId: 'alex-rivera',
    candidateName: 'Alex Rivera',
    candidateImage: 'https://lh3.googleusercontent.com/aida/AEtjO1X_h_Zxh9mc4eN-kxwT0uCu3XyTStvjy4hX_oG3XAJrxpEYv9ZOox-FzcMmUvd3pXvW-w0cPJp6-v74WMaRFVXcowrEdu1aEPxj7Q0NGbOR0MMi_Zzc8HE4NUkaZKTknTjvj_Dg2iPvPg-8x6Plr1099US4GN5SuDUJiyauGF3qw6aZWQrx7Fd_vQnXqo4ATbeAQwoEXPRV5qW6M0pOHP7bCBVMRsnjE0uHEAzxjex1OCXFpdajcoGMhDo',
    lastMessage: 'I just grabbed a small booth near the window. Code ready!',
    lastMessageTime: '11:28 AM',
    unreadCount: 1,
    hasActiveEscrow: true,
    meetingVenue: 'Café Gitane',
    meetingTime: '11:30 AM',
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: 'Hey Elena! Loved your taste in architectural restoration.',
        timestamp: 'Yesterday, 6:15 PM'
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'Thanks Alex! Let\'s skip the weeks of texting and grab a coffee.',
        timestamp: 'Yesterday, 7:02 PM'
      },
      {
        id: 'm3',
        sender: 'partner',
        text: '100%. I staked 5 Vows for Café Gitane tomorrow at 11:30 AM.',
        timestamp: 'Yesterday, 7:15 PM',
        isDateProposal: true,
        proposalDetails: {
          venue: 'Café Gitane',
          time: '11:30 AM',
          stakedVows: 5
        }
      },
      {
        id: 'm4',
        sender: 'partner',
        text: 'I just grabbed a small booth near the window. Code ready!',
        timestamp: '11:28 AM'
      }
    ]
  },
  {
    id: 'conv-mariana',
    candidateId: 'mariana-costa',
    candidateName: 'Mariana Costa',
    candidateImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwZdUoGNeeCwFfCQWpuuVkEjlkpXsjpxk6y1Hx7fImKenk0d5_a3hRKO9LbdoK90Rlw26LXvFZN9GqWfjyXuhwjG00WzMNS1VjMga6diHdS9K_P55IpmD0Vf1btM_kz7IDwbSLSX68KG8ya2kjThChFgiY6BoBO7SaKdxeY2IQmUx_lw41NXR-YIV3aYSMN-GqZrHAG_mzQPZ-XG_qAXNWUbcZ7VjXFgZKo3bxY-8xoj3FNzTgqoKy9A',
    lastMessage: '“Curating spaces and collecting rare vinyl...”',
    lastMessageTime: '10:14 AM',
    unreadCount: 0,
    hasActiveEscrow: false,
    messages: [
      {
        id: 'm10',
        sender: 'partner',
        text: 'Hi Elena! Vow received. Have you been to the new ceramics exhibition in Pinheiros?',
        timestamp: '10:14 AM'
      }
    ]
  }
];
