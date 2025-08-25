import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

type ManifestFile = {
  name: string;
  type: 'file';
  path: string;
  size?: number;
  ext?: string | null;
};

type ManifestDir = {
  name: string;
  type: 'dir';
  path: string;
  children: ManifestNode[];
};

type ManifestNode = ManifestFile | ManifestDir;

type Manifest = {
  project: string;
  generatedAt: string;
  coreFiles: ManifestNode[];
  roots: ManifestNode[];
};

export default function StructureScreen() {
  const manifest: Manifest = useMemo(() => {
    // Using require to avoid TS resolveJsonModule requirement
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require('../assets/structure-manifest.json');
    return data as Manifest;
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Структура проекта: {manifest.project}</Text>
      <Text style={styles.meta}>Сгенерировано: {new Date(manifest.generatedAt).toLocaleString()}</Text>

      <Section title="Core files">
        {manifest.coreFiles.map((node) => (
          <TreeNode key={node.path} node={node} depth={0} />
        ))}
      </Section>

      <Section title="Roots">
        {manifest.roots.map((node) => (
          <TreeNode key={node.path} node={node} depth={0} />
        ))}
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function TreeNode({ node, depth }: { node: ManifestNode; depth: number }) {
  const isDir = node.type === 'dir';
  const [expanded, setExpanded] = useState(depth < 1);

  if (isDir) {
    const dir = node as ManifestDir;
    return (
      <View style={styles.nodeContainer}>
        <Pressable onPress={() => setExpanded((v) => !v)} style={styles.row}>
          <Text style={styles.dirLabel}>[D] {dir.name}</Text>
          <Text style={styles.metaSmall}>{expanded ? '−' : '+'}</Text>
        </Pressable>
        {expanded && (
          <View style={[styles.children, { marginLeft: (depth + 1) * 12 }]}>
            {dir.children.map((child) => (
              <TreeNode key={child.path} node={child} depth={depth + 1} />
            ))}
          </View>
        )}
      </View>
    );
  }

  const file = node as ManifestFile;
  return (
    <View style={[styles.row, { marginLeft: depth * 12 }]}> 
      <Text style={styles.fileLabel}>[F] {file.name}</Text>
      {typeof file.size === 'number' && (
        <Text style={styles.metaSmall}>{file.size}b</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  meta: { fontSize: 12, color: '#64748b', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#0f172a' },
  sectionBody: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2 },
  nodeContainer: { marginBottom: 2 },
  children: { marginTop: 2 },
  dirLabel: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  fileLabel: { fontSize: 13, color: '#334155' },
  metaSmall: { fontSize: 12, color: '#94a3b8' },
});

