"use client"

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '1px solid #0052cc',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0052cc',
    },
    headline: {
        fontSize: 14,
        marginTop: 4,
        color: '#666',
    },
    contact: {
        fontSize: 10,
        marginTop: 8,
        color: '#444',
    },
    section: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0052cc',
        borderBottom: '1px solid #EEEEEE',
        paddingBottom: 4,
        marginBottom: 10,
    },
    summary: {
        fontSize: 11,
        lineHeight: 1.5,
        color: '#333',
    },
    experienceEntry: {
        marginBottom: 12,
    },
    entryTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    entrySubTitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    entryDescription: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#444',
    },
    skills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 5,
    },
    skillTag: {
        fontSize: 10,
        padding: '4 8',
        backgroundColor: '#F0F4FF',
        color: '#0052cc',
        borderRadius: 4,
    }
});

interface Experience {
    company: string;
    role: string;
    from: string;
    to: string;
    description: string;
}

interface Education {
    school: string;
    degree: string;
    year: string;
}

interface CVData {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    headline?: string;
    summary?: string;
    skills?: string;
    experience?: Experience[];
    education?: Education[];
}

export function CVDocument({ data }: { data: CVData }) {
    const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()) : [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.name}</Text>
                    {data.headline && <Text style={styles.headline}>{data.headline}</Text>}
                    <Text style={styles.contact}>
                        {data.email} {data.phone ? `| ${data.phone}` : ''} {data.location ? `| ${data.location}` : ''}
                    </Text>
                </View>

                {/* Summary */}
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profil</Text>
                        <Text style={styles.summary}>{data.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                        {data.experience.map((exp, i) => (
                            <View key={i} style={styles.experienceEntry}>
                                <Text style={styles.entryTitle}>{exp.role} chez {exp.company}</Text>
                                <Text style={styles.entrySubTitle}>{exp.from} - {exp.to}</Text>
                                <Text style={styles.entryDescription}>{exp.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Formation</Text>
                        {data.education.map((edu, i) => (
                            <View key={i} style={styles.experienceEntry}>
                                <Text style={styles.entryTitle}>{edu.degree}</Text>
                                <Text style={styles.entrySubTitle}>{edu.school} | {edu.year}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skillsArray.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Compétences</Text>
                        <View style={styles.skills}>
                            {skillsArray.map((skill, i) => (
                                <Text key={i} style={styles.skillTag}>{skill}</Text>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
}
