import Link from 'next/link';
export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <Link key={label} href={href}>
          <a className='navbar-item'>{label}</a>
        </Link>
      );
    });
  return (
    <nav
      className='navbar is-dark'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='navbar-brand'>
        <Link href='/'>
          <a className='navbar-item title is-1 is-light'>Aleatory</a>
        </Link>
      </div>
      <div className='navbar-menu'>
        <div className='navbar-start'>{links}</div>
      </div>
    </nav>
  );
};
