'use client';

import Image from 'next/image';

export default function Environment() {
    return (
        <div>
            <section className="py-4 bg-white">
                <div className='max-w-6xl mx-auto flex flex-col md:flex-row'>
                    <div className='px-4'>
                        <Image
                            src='/images/display/store1.jpg'
                            alt='Store Image 1'
                            width={600}
                            height={600}
                            className='w-full object-cover rounded'
                            unoptimized
                        />
                        <Image
                            src='/images/display/store2.jpg'
                            alt='Store Image 2'
                            width={600}
                            height={600}
                            className='w-full object-cover rounded pt-4'
                            unoptimized
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}