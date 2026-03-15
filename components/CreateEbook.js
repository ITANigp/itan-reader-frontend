const CreateEbook = () => {
  return (
    <section className="bg-white overflow-hidden">
      {/* Header with brand accent - added pt-10 for space from close button */}
      <div className="bg-gradient-to-r from-[#FEE6E6] to-[#FFEFF2] p-6 pt-10 border-b border-gray-100">
        <h3 className="text-2xl xs:text-3xl font-bold text-gray-800 mb-2">
          Create Your <span className="text-[#EF5353]">eBook</span>
        </h3>
        <h4 className="text-lg text-gray-600 italic font-medium">
          Step-by-step guide to publishing your book
        </h4>
      </div>

      {/* Main content area */}
      <div className="p-6 xs:p-8">
        <p className="text-gray-700 mb-6 leading-relaxed">
          Publishing your book successfully and making it easily discoverable
          requires following these important steps:
        </p>

        {/* Numbered steps with visual enhancements */}
        <ol className="space-y-6 mb-8">
          {/* Step 1 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                1
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Prepare a Polished Manuscript
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Ensure your manuscript is well-edited and professionally
                  formatted. We recommend hiring a professional editor and
                  desktop publisher. Alternatively, you may edit and format it
                  yourself if you're proficient with Word documents. Manuscripts
                  that are poorly edited or formatted will not be accepted for
                  publishing.
                </p>
              </div>
            </div>
          </li>

          {/* Step 2 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                2
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Design an Eye-Catching Cover
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Your book is a product, and its presentation matters. A poorly
                  designed cover may negatively impact our ratings in the
                  international literary market. Get a professionally designed
                  cover for your manuscript. Remember, the cover is the first
                  impression readers get of your book, and a visually appealing
                  design can boost sales.
                </p>
              </div>
            </div>
          </li>

          {/* Step 3 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                3
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Identify Keywords
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Keywords help your book become discoverable in search engines.
                  Identify 3 relevant keywords or tags for your book. For
                  instance, for a book on pain management, the keywords might
                  include: "handling pain," "getting over pain," or "the power
                  of pain." Input these keywords into the designated keyword
                  box.
                </p>
              </div>
            </div>
          </li>

          {/* Step 4 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                4
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Prepare a Book Summary
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Write a compelling "About the Book" summary, as it will be
                  required during submission.
                </p>
              </div>
            </div>
          </li>

          {/* Step 5 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                5
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload Your Manuscript
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Once your manuscript is ready, upload it in any of the
                  acceptable formats (DOC, DOCX, or EPUB).
                </p>
              </div>
            </div>
          </li>

          {/* Step 6 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                6
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload Your Cover
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Upload your professionally designed book cover in the provided
                  space.
                </p>
              </div>
            </div>
          </li>

          {/* Step 7 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                7
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Preview Your Book
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Use the book previewer tool to ensure your book looks as
                  intended before publishing.
                </p>
              </div>
            </div>
          </li>

          {/* Step 8 with sub-items */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                8
              </div>
              <div className="w-full">
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Fill Out Book Details
                </h5>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Complete the required fields, including:
                </p>

                {/* Sub-list with attractive styling */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-2">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Number of pages",
                      "Contributor names",
                      "Book title and subtitle",
                      "Genre and sub-genres",
                      "Copyright information",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-[#EF5353] rounded-full mr-2"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>

          {/* Step 9 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                9
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Publish Your Book
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  Once all steps are complete, click "Publish." It may take up
                  to 24 hours (or less) for us to review your submission and
                  confirm the details before your book appears in the store.
                </p>
              </div>
            </div>
          </li>

          {/* Step 10 */}
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-[#EF5353] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4">
                10
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Promote Your Book
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  After publishing, your book will be assigned a unique
                  identification link. Share this link widely to promote your
                  book and attract readers.
                </p>
              </div>
            </div>
          </li>
        </ol>

        {/* Note box with important information */}
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-blue-600">Remember:</span> The
            quality of your manuscript and cover significantly impacts how well
            your book performs. Taking time to perfect these elements will
            greatly enhance your chances of success.
          </p>
        </div>

        {/* Footer section */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>
            For more detailed publishing instructions, contact our support team
            or visit the help center.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateEbook;
