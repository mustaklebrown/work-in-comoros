import { ImageResponse } from 'next/og';


// Image metadata
export const alt = 'Work-in-Comoros';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    // Fonts
    // We could load custom fonts here, but standard ones work for a start.

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #0052cc 2%, transparent 0%), radial-gradient(circle at 75px 75px, #0052cc 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        opacity: 0.05,
                    }}
                />

                {/* Since we can't easily load local files in Edge runtime without fetch, 
            we'll use a CSS/SVG representation or just text enhancement for now,
            which is often cleaner and faster than optimizing image loading in OG.
         */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}
                >
                    {/* Logo Placeholder / Icon */}
                    <div
                        style={{
                            display: 'flex',
                            width: 120,
                            height: 120,
                            borderRadius: 30,
                            background: 'linear-gradient(135deg, #0052cc, #003399)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 25px -5px rgba(0, 82, 204, 0.4)',
                        }}
                    >
                        <div style={{ color: 'white', fontSize: 60, fontWeight: 800 }}>W</div>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            lineHeight: 1,
                            marginBottom: 20,
                            background: 'linear-gradient(to right, #0052cc, #2563eb)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        W-I-C
                    </div>

                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 600,
                            color: '#475569',
                            letterSpacing: '-0.025em',
                        }}
                    >
                        Plateforme RH & Recrutement
                    </div>

                    <div
                        style={{
                            marginTop: 40,
                            padding: '12px 30px',
                            backgroundColor: '#0052cc',
                            color: 'white',
                            borderRadius: 50,
                            fontSize: 24,
                            fontWeight: 600,
                        }}
                    >
                        work-in-comoros.km
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
