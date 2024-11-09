// src/styles/components.js
import { colors, spacing, borderRadius } from './theme';

export const cardStyles = {
  container: {
    width: '390px',
    height: '844px',
    backgroundColor: colors.white,
    position: 'relative', // Make sure this is set
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative' // Add this
  }
};

export const buttonStyles = {
  base: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '18px',
    width: '100%',
    height: '48px',
    backgroundColor: colors.green.light,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export const inputStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    width: '100%'
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: colors.gray.text,
    textAlign: 'left'
  },
  input: {
    width: '100%',
    height: '48px',
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: '16px',
    border: `1px solid ${colors.gray.border}`,
    borderRadius: borderRadius.sm,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    backgroundColor: colors.gray.lighter
  }
};

export const subheadingStyles = {
  fontSize: '16px',
  color: colors.gray.text,
  opacity: 0.7,
  margin: 0
}

export const titleStyles = {
  fontSize: '32px',
  fontWeight: '600',
  color: colors.gray.text,
  margin: `0 0 ${spacing.xs} 0`
}
export const imageStyles = {
  section: {
    width: '100%',
    position: 'relative',
    height: '45%'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholder: {
    backgroundColor: colors.gray.lighter,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.gray.dark,
    fontSize: '16px'
  }
};

export const badgeStyles = {
  verified: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: `${colors.white}e6`,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: '14px',
    color: colors.blue
  }
};

export const contentStyles = {
  section: {
    padding: spacing.md,
    flex: 1,
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold'
  }
};

export const tagStyles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  tag: {
    backgroundColor: colors.gray.lighter,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.lg,
    fontSize: '14px',
    color: colors.gray.dark
  }
};

export const textStyles = {
  bio: {
    fontSize: '16px',
    color: colors.gray.dark,
    marginBottom: spacing.md,
    lineHeight: '1.5'
  }
};

export const detailStyles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    fontSize: '16px',
    color: colors.gray.dark
  }
};

export const scoreStyles = {
  tag: (score) => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: spacing.md,
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: score >= 75 ? '#dcfce7' : score >= 25 ? colors.orange.light : '#fee2e2',
    color: score >= 75 ? colors.green.dark : score >= 25 ? colors.orange.dark : colors.red.dark
  })
};

export const logoStyles = {
  container: {
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '60px',
    flexShrink: 0
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    opacity: 0.9
  }
};

export const contentContainerStyles = {
  container: {
    width: '100%',
    padding: `0 ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
    maxWidth: '350px',
    marginTop: spacing.xl,
    flexGrow: 1,
    overflow: 'auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: spacing.xl
  },
}

export const formStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg
}

export const linkStyles = {
  nonLink: {
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: '14px',
    color: colors.gray.text
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '500'
  }
}