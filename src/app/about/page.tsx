import Image from "next/image";
import { HiLink, HiOutlineDesktopComputer, HiCheckCircle, HiGlobeAlt } from "react-icons/hi"; // import icon yang kita butuhkan

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tentang SkillMentor
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            SkillMentor adalah platform penghubung antara murid dan tutor
            profesional untuk belajar skill praktis yang relevan dengan dunia
            industri. Kami percaya setiap orang berhak mendapatkan akses belajar
            berkualitas langsung dari ahlinya.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Misi Kami</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Misi SkillMentor adalah menjembatani kesenjangan antara dunia
              pendidikan dan dunia kerja dengan menghadirkan pembelajaran
              berbasis praktik yang dibimbing langsung oleh mentor
              berpengalaman.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami ingin menciptakan ekosistem belajar yang fleksibel,
              terjangkau, dan berorientasi pada hasil nyata.
            </p>
          </div>
          <div className="relative w-full aspect-[4/3] max-h-80 rounded-2xl overflow-hidden">
            <Image
              src="/images/image1.jpg"
              alt="Misi SkillMentor"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Apa yang Kami Lakukan
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Menghubungkan Murid & Tutor",
                desc: "Kami mempertemukan murid dengan tutor yang sesuai dengan kebutuhan skill mereka.",
                icon: <HiLink className="text-4xl mb-4 text-blue-500" />,
              },
              {
                title: "Pembelajaran Praktis",
                desc: "Fokus pada praktik langsung, bukan hanya teori.",
                icon: <HiOutlineDesktopComputer className="text-4xl mb-4 text-green-500" />,
              },
              {
                title: "Verifikasi Tutor",
                desc: "Setiap tutor melalui proses seleksi untuk menjaga kualitas.",
                icon: <HiCheckCircle className="text-4xl mb-4 text-yellow-500" />,
              },
              {
                title: "Fleksibel & Online",
                desc: "Belajar kapan saja dan di mana saja sesuai jadwalmu.",
                icon: <HiGlobeAlt className="text-4xl mb-4 text-purple-500" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div>{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SkillMentor */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-[4/3] max-h-80 rounded-2xl overflow-hidden">
            <Image
              src="/images/image2.jpg"
              alt="Kenapa SkillMentor"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Kenapa SkillMentor?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Banyak platform belajar hanya menyediakan video. SkillMentor hadir
              dengan pendekatan berbeda: kamu belajar langsung dengan mentor,
              bisa tanya, diskusi, dan dibimbing step by step.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami fokus pada skill yang benar-benar dibutuhkan industri seperti
              desain, 3D, programming, digital marketing, dan lainnya.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Berkembang Bersama SkillMentor?
          </h2>
          <p className="text-gray-300 mb-8">
            Bergabunglah sebagai murid untuk belajar, atau sebagai tutor untuk
            berbagi ilmu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tutor/apply-tutor"
              className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Daftar Jadi Tutor
            </a>
            <a
              href="/homepage"
              className="border border-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-black transition"
            >
              Mulai Belajar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
