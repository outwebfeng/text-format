import { ns } from '@/lib/text-format/messages';

export function StandardInfoSections({
  namespace,
  featureCount,
  includeHowTo = false,
  includeUseCases = false,
}: {
  namespace: string;
  featureCount: number;
  includeHowTo?: boolean;
  includeUseCases?: boolean;
}) {
  return (
    <div className="mx-auto mt-14 w-full max-w-5xl text-[#17221d]">
      <section className="border-t border-[#d8e4dc] pt-10">
        <h2 className="mb-4 text-3xl font-extrabold">{ns(namespace, 'about_title')}</h2>
        <p className="text-lg leading-8 text-[#5c6d63]">{ns(namespace, 'about_desc')}</p>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-3xl font-extrabold">{ns(namespace, 'features_title')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: featureCount }, (_, index) => index + 1).map((i) => (
          <div key={i} className="rounded-lg border border-[#d8e4dc] bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-xl font-bold text-[#17221d]">{ns(namespace, `feature_${i}_title`)}</h3>
            <p className="leading-7 text-[#5c6d63]">{ns(namespace, `feature_${i}_desc`)}</p>
          </div>
        ))}
      </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-3xl font-extrabold">{ns(namespace, 'faq_title')}</h2>
      <div className="divide-y divide-[#d8e4dc] rounded-lg border border-[#d8e4dc] bg-white">
        {Array.from({ length: 6 }, (_, index) => index + 1).map((i) => (
          <div key={i} className="p-5">
            <h3 className="mb-2 text-xl font-bold text-[#17221d]">{ns(namespace, `faq_${i}_title`)}</h3>
            <p className="leading-7 text-[#5c6d63]">{ns(namespace, `faq_${i}_desc`)}</p>
          </div>
        ))}
      </div>
      </section>

      {includeHowTo ? (
        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-extrabold">{ns(namespace, 'how_to_use_title')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => index + 1).map((i) => (
              <div key={i} className="rounded-lg border border-[#d8e4dc] bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#17221d]">{ns(namespace, `step_${i}_title`)}</h3>
                <p className="leading-7 text-[#5c6d63]">{ns(namespace, `step_${i}_desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {includeUseCases ? (
        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-extrabold">{ns(namespace, 'use_cases_title')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => index + 1).map((i) => (
              <div key={i} className="rounded-lg border border-[#d8e4dc] bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#17221d]">{ns(namespace, `use_case_${i}_title`)}</h3>
                <p className="leading-7 text-[#5c6d63]">{ns(namespace, `use_case_${i}_desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function TextCleanHelpSection() {
  const renderH4List = (items: Array<[string, string]>) => (
    <ol className="list-disc pl-5">
      {items.map(([title, body]) => (
        <li key={title} className="mb-3">
          <h4 className="mb-1 text-lg font-bold text-[#17221d]">{ns('textClean', title)}</h4>
          <p className="leading-7 text-[#5c6d63]">{ns('textClean', body)}</p>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="mx-auto mt-14 w-full max-w-5xl text-[#17221d]">
      <section className="border-t border-[#d8e4dc] pt-10">
        <h2 className="mb-4 text-3xl font-extrabold">{ns('textClean', 'h2_1')}</h2>
        <p className="text-lg leading-8 text-[#5c6d63]">{ns('textClean', 'h2_1_p')}</p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-3xl font-extrabold">{ns('textClean', 'h2_2')}</h2>
        <p className="text-lg leading-8 text-[#5c6d63]">{ns('textClean', 'h2_2_p')}</p>
      <ol className="mt-6 list-decimal space-y-6 pl-5">
        <li>
          <h3 className="mb-2 text-xl font-bold">{ns('textClean', 'h2_2_h3_1')}</h3>
          <p className="leading-7 text-[#5c6d63]">{ns('textClean', 'h2_2_h3_1_p')}</p>
        </li>
        <li>
          <h3 className="mb-2 text-xl font-bold">{ns('textClean', 'h2_2_h3_2')}</h3>
          <p className="leading-7 text-[#5c6d63]">{ns('textClean', 'h2_2_h3_2_p')}</p>
          {renderH4List([
            ['h2_2_h3_2_h4_1', 'h2_2_h3_2_h4_1_p'],
            ['h2_2_h3_2_h4_2', 'h2_2_h3_2_h4_2_p'],
            ['h2_2_h3_2_h4_3', 'h2_2_h3_2_h4_3_p'],
            ['h2_2_h3_2_h4_4', 'h2_2_h3_2_h4_4_p'],
          ])}
        </li>
        {[3, 4].map((i) => (
          <li key={i}>
            <h3 className="mb-2 text-xl font-bold">{ns('textClean', `h2_2_h3_${i}`)}</h3>
            <p className="leading-7 text-[#5c6d63]">{ns('textClean', `h2_2_h3_${i}_p`)}</p>
          </li>
        ))}
      </ol>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-3xl font-extrabold">{ns('textClean', 'h2_3')}</h2>
        <p className="text-lg leading-8 text-[#5c6d63]">{ns('textClean', 'h2_3_p_1')}</p>
      <ol className="mt-6 list-decimal space-y-6 pl-5">
        {[
          ['h2_3_h3_1', 5],
          ['h2_3_h3_2', 6],
          ['h2_3_h3_3', 4],
          ['h2_3_h3_4', 3],
          ['h2_3_h3_5', 10],
        ].map(([section, count]) => (
          <li key={section}>
            <h3 className="mb-2 text-xl font-bold">{ns('textClean', section as string)}</h3>
            {renderH4List(
              Array.from({ length: count as number }, (_, index) => [
                `${section}_h4_${index + 1}`,
                `${section}_h4_${index + 1}_p`,
              ])
            )}
          </li>
        ))}
      </ol>
      <p className="mt-6 text-lg leading-8 text-[#5c6d63]">{ns('textClean', 'h2_3_p_2')}</p>
      </section>
    </div>
  );
}
