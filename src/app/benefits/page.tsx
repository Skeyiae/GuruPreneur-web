import { FaGamepad, FaBriefcase, FaChalkboardTeacher, FaFolderOpen, FaPalette, FaClock } from "react-icons/fa";

export default function BenefitsPage() {
  const benefits = [
    {
      title: "Skill Industri Nyata",
      desc: "Pelajari Blender 3D dengan standar industri yang digunakan di game, film, arsitektur, dan animasi profesional.",
      icon: <FaGamepad className="w-12 h-12 text-indigo-500 mb-4" />,
    },
    {
      title: "Peluang Karier Luas",
      desc: "Buka jalan menjadi 3D Artist, Game Asset Designer, Animator, hingga Freelance 3D Creator.",
      icon: <FaBriefcase className="w-12 h-12 text-indigo-500 mb-4" />,
    },
    {
      title: "Belajar dari Praktisi",
      desc: "Dibimbing langsung oleh mentor berpengalaman yang aktif di dunia kerja, bukan sekadar teori.",
      icon: <FaChalkboardTeacher className="w-12 h-12 text-indigo-500 mb-4" />,
    },
    {
      title: "Portofolio Siap Pakai",
      desc: "Setiap project yang kamu buat bisa langsung dijadikan portofolio untuk melamar kerja atau freelance.",
      icon: <FaFolderOpen className="w-12 h-12 text-indigo-500 mb-4" />,
    },
    {
      title: "Kreativitas Tanpa Batas",
      desc: "Tuangkan ide kreatifmu ke dalam bentuk 3D: karakter, environment, product visual, dan lainnya.",
      icon: <FaPalette className="w-12 h-12 text-indigo-500 mb-4" />,
    },
    {
      title: "Belajar Fleksibel",
      desc: "Atur jadwal belajar sesuai waktu luangmu, bisa dari mana saja dan kapan saja.",
      icon: <FaClock className="w-12 h-12 text-indigo-500 mb-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Keuntungan Belajar Blender 3D di SkillMentor
        </h1>
        <p className="text-gray-600 text-lg">
          Tingkatkan skill, bangun portofolio, dan siapkan kariermu di dunia industri kreatif bersama mentor terbaik.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-center"
          >
            {item.icon}
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Siap Menguasai Blender 3D & Bangun Masa Depanmu?
        </h2>
        <p className="text-gray-600 mb-6">
          Mulai belajar sekarang bersama mentor pilihanmu di SkillMentor.
        </p>
        <a
          href="/tutor/apply-tutor"
          className="inline-block bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Mulai Sekarang
        </a>
      </div>
    </div>
  );
}
