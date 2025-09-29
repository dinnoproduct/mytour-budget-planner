import './index.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PackagesHeader = () => {
	const { t } = useTranslation()
	
	return (
		<div className="header text-center font-bold background">
			<div className="container">
				<img className="packages-logo" src="/images/logo.svg" alt=""/>
				<div className="top-title">{t('packagesHeader.title')}</div>
				<div className="sub-title inline-block">
					{t('packagesHeader.subtitle')}
				</div>
			</div>
		</div>
	)
}

export default PackagesHeader
