const IgpModal = () => {
  return (
    <section className="bg-white overflow-hidden">
      {/* Header with brand accent - added pt-10 for space from close button */}
      <div className="bg-gradient-to-r from-[#FEE6E6] to-[#FFEFF2] p-6 pt-10 border-b border-gray-100">
        <h3 className="text-2xl xs:text-3xl font-bold text-gray-800 mb-2">
          WHAT IS <span className="text-[#EF5353]">IGP</span>
        </h3>
        <h4 className="text-lg text-gray-600 italic font-medium">
          IGP stands for Itan Global Publishing
        </h4>
      </div>

      {/* Main content with proper spacing */}
      <div className="p-6 xs:p-8">
        <p className="text-gray-700 mb-8 leading-relaxed">
          IGP lets you self-publish eBooks and audiobooks for free, providing
          direct access to showcase your book on Itan Stores. You can create a
          dedicated product detail page for your book, enhancing its visibility.
          Additionally, IGP also provides tools to translate your book into
          multiple languages and publish audio files (if available), expanding
          your global readership.
        </p>

        <div className="relative mb-6">
          <h3 className="text-xl xs:text-2xl font-bold text-gray-800 mb-4 inline-flex items-center">
            <span className="bg-[#EF5353] w-2 h-8 mr-3 rounded-sm inline-block"></span>
            Content Guidelines
          </h3>
          <h4 className="text-lg text-[#EF5353] font-medium mb-6">
            Supported eBook/Audiobook Formats
          </h4>
        </div>

        <ul className="space-y-6">
          <li className="bg-gray-50 p-4 xs:p-6 rounded-lg border-l-4 border-[#EF5353] shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">
              Illegal or infringing content:
            </h4>
            <p className="text-gray-600 text-sm xs:text-base leading-relaxed">
              We strictly enforce legal and proprietary rights. Authors,
              publishers, and sellers must ensure their content complies with
              copyright, trademark, privacy, and other laws. Copyrighted content
              freely available online will only be accepted if submitted by the
              rights owner.
            </p>
          </li>

          <li className="bg-gray-50 p-4 xs:p-6 rounded-lg border-l-4 border-[#EF5353] shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">
              Offensive Content
            </h4>
            <p className="text-gray-600 text-sm xs:text-base leading-relaxed">
              We do not sell content that includes hate speech, promotes child
              abuse or exploitation, contains pornography, glorifies rape or
              pedophilia, supports terrorism, or any other material we consider
              inappropriate or offensive.
            </p>
          </li>

          <li className="bg-gray-50 p-4 xs:p-6 rounded-lg border-l-4 border-[#EF5353] shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">
              Poor Customer Experience
            </h4>
            <p className="text-gray-600 text-sm xs:text-base leading-relaxed">
              Books sold on ITAN should offer a positive customer experience.
              Content that is misleading, inaccurately represents the book, or
              is generally unsatisfactory to customers is not allowed. We may
              adjust a book's category at any time to maintain a high-quality
              browsing experience.
            </p>
          </li>
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>
            For more information, contact our support team or visit the help
            center.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IgpModal;
