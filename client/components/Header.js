import Link from 'next/link';
export default ({ currentUser }) => {
  const [isActive, setisActive] = React.useState(false);
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Something', href: '/products/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
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
      className='navbar is-primary'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='navbar-brand'>
        <Link href='/'>
          <a className='navbar-item title is-1 is-light main-font'>Aleatory</a>
        </Link>
        <a
          onClick={() => {
            setisActive(!isActive);
          }}
          role='button'
          className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
          aria-label='menu'
          aria-expanded='false'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>
      <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className='navbar-start'>{links}</div>
      </div>
    </nav>
  );
};
