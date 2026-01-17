import { GiSkills } from "react-icons/gi";
import { FaBriefcase } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { FaFolder } from "react-icons/fa";
import { FaPalette } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";

export default function BenefitsPage() {
  const benefits = [
    {
      title: "Skill Industri Nyata",
      desc: "Pelajari Blender 3D dengan standar industri yang digunakan di game, film, arsitektur, dan animasi profesional.",
      icon: <GiSkills />,
    },
    {
      title: "Peluang Karier Luas",
      desc: "Buka jalan menjadi 3D Artist, Game Asset Designer, Animator, hingga Freelance 3D Creator.",
      icon: <FaBriefcase />,
    },
    {
      title: "Belajar dari Praktisi",
      desc: "Dibimbing langsung oleh mentor berpengalaman yang aktif di dunia kerja, bukan sekadar teori.",
      icon: <PiStudentBold />,
    },
    {
      title: "Portofolio Siap Pakai",
      desc: "Setiap project yang kamu buat bisa langsung dijadikan portofolio untuk melamar kerja atau freelance.",
      icon: <FaFolder />,
    },
    {
      title: "Kreativitas Tanpa Batas",
      desc: "Tuangkan ide kreatifmu ke dalam bentuk 3D: karakter, environment, product visual, dan lainnya.",
      icon: <FaPalette />,
    },
    {
      title: "Belajar Fleksibel",
      desc: "Atur jadwal belajar sesuai waktu luangmu, bisa dari mana saja dan kapan saja.",
      icon: <IoIosTimer />,
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
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
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
