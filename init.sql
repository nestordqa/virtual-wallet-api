DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'wallet_db') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE wallet_db');
    END IF;
END $$;
