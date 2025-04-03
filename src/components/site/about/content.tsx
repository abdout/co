import React from 'react'

const introduction = () => {
    return (
        <div className='space-y-6'>
            <h4>
                Imagine a canvas where every project is a story waiting to be told. At the heart of precision, innovation is the spark that turns challenges into vibrant opportunities.
            </h4>
            <h4>
                Complex systems come alive as harmonious symphonies, each note meticulously tuned by creative experts who blend art with science. They transform obstacles into blank canvases, painting bespoke solutions that resonate with passion and precision. Step into a narrative of technical brilliance, where every test and commission unfolds as a masterpiece of excellence.
            </h4>

        </div>

    )
}

const changelog = () => {
    return (
        <div className='space-y-4 py-10'>
            <h4>AI Enhanced<br />Testing Accuracy</h4>
            <p>Apr 2025</p>

            <h4>Revamped Protocol<br />For Safety</h4>
            <p>Mar 2025</p>

            <h4>Real-Time<br />Performance Insights</h4>
            <p>Mar 2025</p>

            <h4>Expanded Services<br />Energy Solutions</h4>
            <p>Feb 2025</p>

            <h4>Updated Procedures<br />Project Precision</h4>
            <p>Feb 2025</p>

            <h4>Company Established<br />Flagship Branch</h4>
            <p>Jan 2025</p>

            <h4>Mission Unveiled<br />Future Excellence</h4>
            <p>Jan 2025</p>
        </div>
    )
}

const policy = () => {
    return (
        <div className='space-y-4 py-10'>
            <h4>Our Legacy</h4>
            <p>With over two decades of experience in testing and commissioning, we've established ourselves as industry leaders in ensuring the reliability and performance of critical systems. Our journey began with a simple mission: to deliver excellence in every project we undertake.</p>

            <h4>Our Expertise</h4>
            <p>We specialize in comprehensive testing and commissioning services across various sectors including commercial buildings, industrial facilities, and infrastructure projects. Our team of certified professionals brings unparalleled expertise to every assignment.</p>

            <h4>Our Approach</h4>
            <p>We believe in a methodical, thorough approach to testing and commissioning. Every project undergoes our rigorous quality assurance process, ensuring that all systems meet or exceed industry standards and client expectations.</p>

            <h4>Innovation & Technology</h4>
            <p>Staying at the forefront of technological advancement, we utilize state-of-the-art testing equipment and innovative methodologies to deliver accurate, reliable results. Our commitment to innovation drives continuous improvement in our services.</p>
        </div>
    )
}


export const Content = () => {
    return (
        <div className='max-w-[80%] py-40'>
            {introduction()}
            {changelog()}
            {policy()}
        </div>
    );
};

