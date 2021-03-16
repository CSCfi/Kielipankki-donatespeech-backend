export interface DomainProps {
    domainName: string;
    siteSubDomain: string;

}

export function getSiteDomain(props: DomainProps): string {
    return (props.siteSubDomain == '' ? '' : (props.siteSubDomain + '.')) + props.domainName;
}